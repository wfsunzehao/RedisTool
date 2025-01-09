using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using redis.WebAPi.Model.UserModels;
using redis.WebAPi.Repository.AppDbContext;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using redis.WebAPi.Service;
using redis.WebAPi.Filters;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (string.IsNullOrEmpty(token))
        {
            return BadRequest(new { message = "Token is required." });
        }

        return Ok(new { message = "Logout successful." });
    }

    // Login functionality
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);
        if (!PasswordHasher.VerifyPassword(model.Password, user.PasswordHash, user.Salt))
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        var token = GenerateJwtToken(user);

        return Ok(new { token, role = user.Role });

    }

    // Registration functionality
    [HttpPost("register")]
    [ServiceFilter(typeof(AuthFilter))]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        // Check if the username 
        if (await _context.Users.AnyAsync(u => u.Username == model.Username))
        {
            return BadRequest(new { message = "Username already exists." });
        }

        var (hash, salt) = PasswordHasher.HashPassword(model.Password);

        // Password validation: Ensure password is at least 8 characters long and contains both letters and numbers
        if (!IsValidPassword(model.Password))
        {
            return BadRequest(new { message = "Password must be at least 8 characters long and contain both letters and numbers." });
        }


        // Create a new user
        var user = new User
        {
            Username = model.Username,
            PasswordHash = hash,
            Salt = salt,
            Role = "user"
        };

        // Add the user to the database
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Return success message
        return Ok(new { message = "User registered successfully." });
    }

    // Change password functionality
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest model)
    {
        // Find the user by username
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);
        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        // Verify the old password
        if (!IsValidPassword(model.OldPassword))
        {
            return Unauthorized(new { message = "Old password is incorrect." });
        }

        // Validate the new password
        if (!IsValidPassword(model.NewPassword))
        {
            return BadRequest(new { message = "Password must be at least 8 characters long and contain both letters and numbers." });
        }

        // Hash the new password
        var hashedPassword = PasswordHasher.HashPassword(model.NewPassword);

        // Update the password
        user.PasswordHash = hashedPassword.hash;
        user.Salt = hashedPassword.salt;
        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Password changed successfully." });
    }

    // Password validation method
    private bool IsValidPassword(string password)
    {
        // Password must be at least 8 characters long and contain both letters and numbers
        var passwordRegex = new Regex(@"^(?=.*[a-zA-Z])(?=.*\d).{8,}$");
        return passwordRegex.IsMatch(password);
    }

    // Generate JWT Token
    private string GenerateJwtToken(User user)
    {
        var claims = new[] {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["JwtSettings:ExpirationInMinutes"])),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // Get the current logged-in user's ID from the JWT token
    private int? GetUserIdFromToken()
    {
        var userPrincipal = GetClaimsPrincipalFromToken();
        if (userPrincipal == null)
        {
            return null;
        }

        var userIdClaim = userPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return null;
        }

        return int.TryParse(userIdClaim, out var userId) ? userId : (int?)null;
    }

    // Extract and validate the JWT token from the request header
    private ClaimsPrincipal GetClaimsPrincipalFromToken()
    {
        var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        if (string.IsNullOrEmpty(token))
        {
            return null;
        }

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]);
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = _configuration["JwtSettings:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["JwtSettings:Audience"],
                ValidateLifetime = true,
                IssuerSigningKey = new SymmetricSecurityKey(key)
            };

            return tokenHandler.ValidateToken(token, validationParameters, out _);
        }
        catch
        {
            return null;
        }
    }
}
