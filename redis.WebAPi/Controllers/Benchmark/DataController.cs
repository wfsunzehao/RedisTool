using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using redis.WebAPi.Repository.AppDbContext;

namespace Benchmark_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DataController : ControllerBase
    {
        private readonly BenchmarkDbContext _dbContext;

        // 通过依赖注入获取 BenchmarkDbContext
        public DataController(BenchmarkDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("AllData")]
        public async Task<IActionResult> Get()
        {
            var data = await _dbContext.BenchmarkData1
                .Select(b => new
                {
                    b.Id,
                    b.CacheName,
                    b.TotalDuration,
                    b.TimeUnit,
                    b.GetsRPS,
                    b.GetsAverageLatency,
                    b.GetsP50,
                    b.GetsP99,
                    b.GetsP99_90,
                    b.GetsP99_99
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("FinalData")]
        public async Task<IActionResult> FinalGet()
        {
            var data = await _dbContext.FinalBenchmarkData
                .Select(f => new
                {
                    f.Id,
                    f.CacheName,
                    f.TotalDuration,
                    f.TimeUnit,
                    f.GetsRPS,
                    f.GetsAverageLatency,
                    f.GetsP50,
                    f.GetsP99,
                    f.GetsP99_90,
                    f.GetsP99_99
                })
                .ToListAsync();

            return Ok(data);
        }
    }
}
