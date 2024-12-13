using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration; // Import IConfiguration namespace
using redis.WebAPi.Service;
using System.Linq;

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
            if (string.IsNullOrEmpty(token) || !TokenStore.IsValidToken(token))
            {
                context.Result = new UnauthorizedObjectResult(new { message = "Unauthorized" });
                return;
            }

            base.OnActionExecuting(context);
        }
    }
}
