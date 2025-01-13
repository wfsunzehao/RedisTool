using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using redis.WebAPi.Repository.AppDbContext;

namespace redis.WebAPi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParametersController : ControllerBase
    {
        private readonly BenchmarkDbContext _dbContext;

        public ParametersController(BenchmarkDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // Use Entity Framework to query the Parameters table
            var parameters = await _dbContext.Parameters
                .Select(p => new
                {
                    p.Name,
                    p.Region,
                    Description = p.Description ?? "No Description",
                    p.Clients,
                    p.Threads,
                    p.Size,
                    p.Requests,
                    p.Pipeline,
                    p.Status,
                    p.TimeStamp
                })
                .ToListAsync(); 

            return Ok(parameters);  
        }
    }
}
