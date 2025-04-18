using Microsoft.AspNetCore.Mvc;
using redis.WebAPi.Service.IService;
using redis.WebAPi.Filters;
using redis.WebAPi.Models;
using redis.WebAPi.Model;

namespace redis.WebAPi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(AuthFilter))]
    public class CreationController : ControllerBase
    {
        private readonly ICreationService _creationService;

        // 锁字典，按方法名称动态管理锁
        private static readonly Dictionary<string, SemaphoreSlim> _locks = new Dictionary<string, SemaphoreSlim>
    {
        { "CreateManualCache", new SemaphoreSlim(1, 1) },
        { "CreateBVTCache", new SemaphoreSlim(1, 1) },
        { "CreatePerfCache", new SemaphoreSlim(1, 1) },
        { "CreateAltCache", new SemaphoreSlim(1, 1) },
        { "CreateP0P1Cache", new SemaphoreSlim(1, 1) }
    };

        public CreationController(ICreationService creationService)
        {
            _creationService = creationService;
        }

        private async Task<IActionResult> ExecuteWithLock(string methodName, Func<Task> action)
        {
            var lockObject = _locks.GetValueOrDefault(methodName);
            if (lockObject == null)
            {
                return BadRequest("Invalid method name for locking.");
            }
            var lockAcquired = lockObject.Wait(0);
            if (!lockAcquired)
            {
                return Conflict($"[{methodName}] is in processing, please retry later。");
            }

            try
            {
                await action(); 
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error occurred: {ex.Message}");
            }
            finally
            {
                lockObject.Release();
            }
        }

        [HttpPost()]
        public async Task<IActionResult> CreateCache([FromBody] RedisRequestModel redisRequest)
        {
            await _creationService.CreateCache(redisRequest);
            return Ok();
        }

        [HttpPost("CreateManualCache")]
        public async Task<IActionResult> CreateManualCache([FromBody] RedisRequestModel redisRequest)
        {
            await _creationService.CreateManualCache(redisRequest);
            return Ok();
        }

        [HttpPost("CreateBVTCache")]
        public Task<IActionResult> CreateBVTCache([FromBody] RedisRequestModel redisRequest)
        {
            return ExecuteWithLock("CreateBVTCache", () => _creationService.CreateBVTCache(redisRequest));
        }


        [HttpPost("CreateBVTCacheByCase")]
        public async Task<IActionResult> CreateBVTCacheByCase([FromBody] RedisRequestModel redisRequest)
        {
            await _creationService.CreateBVTCacheByCase(redisRequest);
            return Ok();
        }

        [HttpPost("CreatePerfCache")]
        public Task<IActionResult> CreatePerfCache([FromBody] PerfRequestModel redisRequest)
        {
            return ExecuteWithLock("CreatePerfCache", () => _creationService.CreatePerfCache(redisRequest));
        }

        [HttpPost("CreateAltCache")]
        public Task<IActionResult> CreateAltCache([FromBody] PerfRequestModel redisRequest)
        {
            return ExecuteWithLock("CreateAltCache", () => _creationService.CreateAltCache(redisRequest));
        }

        [HttpPost("CreateP0P1Cache")]
        public Task<IActionResult> CreateP0P1Cache([FromBody] P0P1RequestModel redisRequest)
        {
            return ExecuteWithLock("CreateP0P1Cache", () => _creationService.CreateP0P1Cache(redisRequest));
        }

    }
}
