using Microsoft.AspNetCore.Mvc;
using redis.WebAPi.Repository.AppDbContext; 
using redis.WebAPi.Model;
using redis.WebAPi.Service.IService;
using redis.WebAPi.Service;

namespace Benchmark_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BenchmarkRunController : ControllerBase
    {
        private readonly BenchmarkDbContext _dbContext;  
        private readonly IConnectionVMService _connectionVMService;
        private readonly BenchmarkService _benchmarkService;

        // Inject BenchmarkDbContext and ConnectionVMService through the constructor
        public BenchmarkRunController(BenchmarkDbContext dbContext, IConnectionVMService connectionVMService, BenchmarkService benchmarkService)
        {
            _dbContext = dbContext;
            _connectionVMService = connectionVMService;
            _benchmarkService = benchmarkService;
        }

        // Receive the front-end parameters, then put them into the database and invoke the VM operation
        [HttpPost]
        public async Task<IActionResult> Post(RunBenchmarkData model)
        {
            try
            {
                var Parameters = new Parameters
                {
                    Name = model.Name,
                    Region = model.Region,
                    Description = model.Description,
                    Clients = model.Clients,
                    Threads = model.Threads,
                    Size = model.Size,
                    Requests = model.Requests,
                    Pipeline = model.Pipeline,
                    Status = 2,  // If the status is 2, it is in the queue
                    TimeStamp = model.TimeStamp,
                    //Times
                };
                _dbContext.Parameters.Add(Parameters);
                await _dbContext.SaveChangesAsync();


                // Call ConnectionVMService to perform the virtual machine operation and get the output
                string vmOutput = await _connectionVMService.ConnectionVM(
                    model.Name,
                    model.Primary,
                    model.Clients,
                    model.Threads,
                    model.Size,
                    model.Requests,
                    model.Pipeline,
                    model.Times,
                    model.TimeStamp
                );

                return Ok(new { message = "Benchmark run completed successfully", output = vmOutput });
            }
            catch (Exception ex)
            {
                await _benchmarkService.UpdateBenchmarkStatus(model.Name, 4);
                return StatusCode(500, new { message = "Error occurred during benchmark execution", error = ex.Message });
            }
        }
    }
}
