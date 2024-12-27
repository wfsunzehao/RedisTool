using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using System;
using System.Threading.Tasks;
using redis.WebAPi.Service.AzureShared; // 引入 ConnectionVMService
using redis.WebAPi.Repository.AppDbContext; // 引入 BenchmarkDbContext
using Microsoft.EntityFrameworkCore;
using redis.WebAPi.Repository.AppDbContext;
using redis.WebAPi.Model;

namespace Benchmark_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowSpecificOrigin")] // 启用 CORS 策略
    public class BenchmarkRunController : ControllerBase
    {
        private readonly BenchmarkDbContext _dbContext;  // 引入 DbContext
        private readonly ConnectionVMService _connectionVMService;

        // 通过构造函数注入 BenchmarkDbContext 和 ConnectionVMService
        public BenchmarkRunController(BenchmarkDbContext dbContext, ConnectionVMService connectionVMService)
        {
            _dbContext = dbContext;
            _connectionVMService = connectionVMService;
        }

        // 接收前端参数，然后放入数据库并调用 VM 操作
        [HttpPost]
        public async Task<IActionResult> Post(RunBenchmarkData model)
        {
            try
            {
                // 插入数据到数据库
                var benchmarkData = new Parameters
                {
                    Name = model.Name,
                    Region = model.Region,
                    Description = model.Description,
                    Clients = model.Clients,
                    Threads = model.Threads,
                    Size = model.Size,
                    Requests = model.Requests,
                    Pipeline = model.Pipeline,
                    Status = 2  // 状态为“2”表示在队列中
                };

                // 将新记录添加到 DbContext
                _dbContext.Parameters.Add(benchmarkData);

                // 保存到数据库
                await _dbContext.SaveChangesAsync();

                Console.WriteLine($"插入成功，Benchmark 任务已保存: {model.Name}");

                // 调用 ConnectionVMService 执行虚拟机操作并获取输出
                string vmOutput = await _connectionVMService.ConnectionVM(
                    model.Name,
                    model.Primary,
                    model.Clients,
                    model.Threads,
                    model.Size,
                    model.Requests,
                    model.Pipeline,
                    model.Times
                );

                // 返回执行结果
                return Ok(new { message = "Benchmark run completed successfully", output = vmOutput });
            }
            catch (Exception ex)
            {
                // 发生异常时返回错误信息
                return StatusCode(500, new { message = "Error occurred during benchmark execution", error = ex.Message });
            }
        }
    }
}
