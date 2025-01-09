using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration; // Import IConfiguration namespace
using Microsoft.IdentityModel.Tokens;
using redis.WebAPi.Service;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace redis.WebAPi.Filters
{
    public class AuthFilter : ActionFilterAttribute
    {
        private readonly IConfiguration _configuration;

        // Constructor injection for IConfiguration
        public AuthFilter(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            // Read the current environment from the configuration
            var environment = _configuration["Environment"];

            // Skip validation if it's a development environment
            if (environment == "Development")
            {
                base.OnActionExecuting(context);
                return;
            }

            // Retrieve the token from the request header
            var token = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            // Validate the token's validity
            if (string.IsNullOrEmpty(token))
            {
                context.Result = new UnauthorizedObjectResult(new { message = "Unauthorized" });
                return;
            }

            try
            {
                var jwtSettings = _configuration.GetSection("JwtSettings");
                var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]);

                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
                var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    context.Result = new UnauthorizedResult();
                    return;
                }

                context.HttpContext.User = principal;
            }
            catch (SecurityTokenException)
            {
                context.Result = new UnauthorizedResult();
            }

        }
    }
}
