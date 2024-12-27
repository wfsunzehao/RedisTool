using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using redis.WebAPi.Repository.AppDbContext;
using redis.WebAPi.Model;

namespace redis.WebAPi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParametersController : ControllerBase
    {
        private readonly BenchmarkDbContext _dbContext;

        // 通过构造函数注入 BenchmarkDbContext
        public ParametersController(BenchmarkDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // 获取所有 Parameters 的 API
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // 使用 Entity Framework 查询 Parameters 表
            var parameters = await _dbContext.Parameters
                .Select(p => new
                {
                    p.Name,
                    p.Region,
                    p.Description,
                    p.Clients,
                    p.Threads,
                    p.Size,
                    p.Requests,
                    p.Pipeline,
                    p.Status
                })
                .ToListAsync();  // 异步执行查询

            return Ok(parameters);  // 返回查询结果
        }
    }
}
