using Microsoft.AspNetCore.Mvc;
using redis.WebAPi.Repository.AppDbContext; 
using redis.WebAPi.Model;
using Microsoft.EntityFrameworkCore;
using redis.WebAPi.Model.BenchmarkModel;
using redis.WebAPi.Service.AzureShared;
using System.Text;
using System.Text.Json;
using Azure.Core;
using Azure.ResourceManager.Compute;
using redis.WebAPi.Filters;

namespace Benchmark_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(AuthFilter))]
    public class BenchmarkRunController : ControllerBase
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ConnectionVMService _connectionVMService;
        private readonly AzureClientFactory _client;
        private static readonly SemaphoreSlim _executeLock = new SemaphoreSlim(1, 1);


        // Inject BenchmarkDbContext and ConnectionVMService through the constructor
        public BenchmarkRunController(ConnectionVMService connectionVMService, IServiceProvider serviceProvider, AzureClientFactory azure)
        {
            _connectionVMService = connectionVMService;
            _serviceProvider = serviceProvider;
            _client = azure;
        }

        public class ExecuteAllTasksRequest
        {
            public string GroupName { get; set; }
            public DateTime Time { get; set; }
        }

        [HttpPost("execute-tasks")]
        public async Task<IActionResult> ExecutePendingTasks(string sub, string group, List<string> vms)
        {
            var lockAcquired = false;
            try
            {
                // ≥¢ ‘¡¢º¥ªÒ»°À¯
                lockAcquired = await _executeLock.WaitAsync(TimeSpan.Zero);
                if (!lockAcquired)
                {
                    return StatusCode(429, "Another task is currently running. Please try again later.");
                }

                await _connectionVMService.ExecuteTasksOnVMs(sub, group, vms);
                return Ok("Task executed successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error executing tasks: {ex.Message}");
            }
            finally
            {
                if (lockAcquired)
                {
                    _executeLock.Release();
                }
            }
        }


        [HttpPost("getVMs")]
        public async Task<IActionResult> GetVMs(string sub, string group)
        {
            try
            {
                var subs =  _client.ArmClient.GetSubscriptionResource(new ResourceIdentifier("/subscriptions/" + sub));
                var groupResource = await subs.GetResourceGroupAsync(group);
                var vms = groupResource.Value.GetVirtualMachines();
                Dictionary<string, string> dic = new Dictionary<string, string>();
                foreach (var vm in vms) 
                {
                    dic.Add(vm.Data.Name, vm.InstanceView().Value.Statuses[1].DisplayStatus);
                }
                return Ok(dic);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error executing tasks: {ex.Message}");
            }
        }

        [HttpPost("FlushQueue")]
        public async Task<IActionResult> FlushTask()
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope()) 
                {
                    var dbContext = scope.ServiceProvider.GetService<BenchmarkContent>();
                    var allQueueItems = dbContext.BenchmarkQueue.ToList();
                    dbContext.BenchmarkQueue.RemoveRange(allQueueItems);
                    dbContext.SaveChanges();
                }
                
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error executing tasks: {ex.Message}");
            }
        }


        [HttpPost("FlushRequest")]
        public async Task<IActionResult> FlushRequest()
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetService<BenchmarkContent>();
                    var allRequestItems = dbContext.BenchmarkRequest.ToList();
                    dbContext.BenchmarkRequest.RemoveRange(allRequestItems);
                    dbContext.SaveChanges();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error executing tasks: {ex.Message}");
            }
        }

        [HttpPost("FinalDataTest")]
        public async Task<IActionResult> FinalData([FromBody] DateTime time)
        {
            try
            {
                await _connectionVMService.FinalDataCollection(time);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error executing tasks: {ex.Message}");
            }
        }

        [HttpPost("InsertQCommandByGroupName")]
        public async Task<IActionResult> InsertQCommandByGroupName([FromBody] string groupName) 
        {
            var list = _connectionVMService.GeneratingQCommendByGroupResourse(groupName).Result;
            try
            {
                foreach (var item in list) 
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var dbContext = scope.ServiceProvider.GetService<BenchmarkContent>();
                        for (int i = 1; i <= item.Times; i++)
                        { 
                            var newItem = new BenchmarkQueueDataModel 
                            { 
                                Name = item.Name+"("+i+")",
                                Clients = item.Clients,
                                pw = item.pw,
                                Size = item.Size,
                                Status = item.Status,
                                TimeStamp = item.TimeStamp,
                                Pipeline = item.Pipeline,
                                Id = item.Id,
                                Description = item.Description,
                                Region = item.Region,
                                Requests = item.Requests,
                                Threads = item.Threads,
                            };
                            var benchmarkRequest = newItem.ToBenchmarkRequestModel();

                            dbContext.BenchmarkQueue.Add(newItem);
                            dbContext.BenchmarkRequest.Add(benchmarkRequest);

                        }
                        await dbContext.SaveChangesAsync();
                    }
                }
                return Ok("Task has been enqueued.");
            }
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = "Error occurred during benchmark execution", error = ex.Message });
            }
        }


        // Receive the front-end parameters, then put them into the database and invoke the VM operation
        [HttpPost("enqueue")]
        public async Task<IActionResult> InvokeVMOperation([FromBody] BenchmarkRequestModel benchmarkRequest)
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetService<BenchmarkContent>();
                    for (int i = 1; i <= benchmarkRequest.Times; i++)
                    {
                        var benchmarkTask = new BenchmarkRequestModel
                        {
                            Name = benchmarkRequest.Name + i,
                            pw = benchmarkRequest.pw,
                            Region = benchmarkRequest.Region,
                            Clients = benchmarkRequest.Clients,
                            Threads = benchmarkRequest.Threads,
                            Size = benchmarkRequest.Size,
                            Requests = benchmarkRequest.Requests,
                            Pipeline = benchmarkRequest.Pipeline,
                            Times = benchmarkRequest.Times,
                            TimeStamp = DateTime.Now,
                            Description = benchmarkRequest.Description,
                            Status = 2
                        };
                        var benchmarkQueue = new BenchmarkQueueDataModel(benchmarkTask);

                        dbContext.BenchmarkQueue.Add(benchmarkQueue);
                        dbContext.BenchmarkRequest.Add(benchmarkTask);

                    }
                    await dbContext.SaveChangesAsync();
                }
                
                return Ok("Task has been enqueued.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error occurred during benchmark execution", error = ex.Message });
            }
        }
        [HttpGet("GetBenchmarkData")]
        public async Task<IActionResult> AddBenchmarkData([FromQuery] string date)
        {
            try
            {
                if (string.IsNullOrEmpty(date) || date.Length != 4)
                {
                    return BadRequest("Invalid date format. Expected format: MMDD (e.g., 0328)");
                }

                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetService<BenchmarkContent>();

                    var results = await dbContext.BenchmarkFinalData
                        .Where(b => b.CacheName.Contains(date))
                        .ToListAsync();
                    if (!results.Any())
                    {
                        return NotFound("No data found for the given date.");
                    }

                    var sb = new StringBuilder();
                    foreach (var item in results)
                    {
                        sb.AppendLine($"Results from: {item.CacheName}");
                        var jsonData = Newtonsoft.Json.JsonConvert.SerializeObject(new
                        {
                            TotalDuration = item.TotalDuration,
                            TimeUnit = item.TimeUnit,
                            GetsRPS = item.GetsRPS,
                            GetsAverageLatency = item.GetsAverageLatency,
                            GetsP50 = item.GetsP50,
                            GetsP99 = item.GetsP99,
                            GetsP99_90 = item.GetsP99_90,
                            GetsP99_99 = item.GetsP99_99,
                            Compressed_Histogram = item.CompressedHistogram

                        }, Newtonsoft.Json.Formatting.Indented);
                        sb.AppendLine(jsonData);
                        sb.AppendLine();
                    }

                    var fileName = $"BenchmarkData_{date}.txt";
                    var fileBytes = Encoding.UTF8.GetBytes(sb.ToString());
                    return File(fileBytes, "text/plain", fileName);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error occurred during data insertion", error = ex.Message });
            }
        

    }


        }
}
