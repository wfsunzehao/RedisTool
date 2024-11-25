using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using redis.WebAPi.Model.UserModels;
using redis.WebAPi.Repository.AppDbContext;
using Microsoft.EntityFrameworkCore;

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

    // 登录功能
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid username or password.");
        }

        var token = GenerateJwtToken(user);

        return Ok(new { Token = token });
    }

    // 注册功能
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        // 检查是否已存在相同的用户名或电子邮件
        if (await _context.Users.AnyAsync(u => u.Username == model.Username))
        {
            return BadRequest("Username already exists.");
        }

        if (await _context.Users.AnyAsync(u => u.Email == model.Email))
        {
            return BadRequest("Email is already in use.");
        }

        // 对密码进行哈希处理
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

        // 创建新的用户
        var user = new User
        {
            Username = model.Username,
            PasswordHash = hashedPassword,
            Email = model.Email,
            Role = model.Role ?? "user",  // 如果没有提供角色，则默认为 "user"
        };

        // 将用户添加到数据库
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // 返回成功消息
        return Ok(new { Message = "User registered successfully." });
    }

    // 生成 JWT Token
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
}


