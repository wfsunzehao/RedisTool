using Azure.Core;
using Azure.ResourceManager;
using Microsoft.AspNetCore.Mvc;
using redis.WebAPi.Model;
using redis.WebAPi.Service;
using redis.WebAPi.Service.AzureShared;
using redis.WebAPi.Service.IService;

namespace redis.WebAPi.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class CreationController : ControllerBase
    {
        private readonly IRedisCollection _redisCollection;

        public CreationController(IRedisCollection redisCollection)
        {
            this._redisCollection = redisCollection;
        }


        [HttpPost()]
        public async Task<IActionResult> CreateCache([FromBody] RedisRequestModel redisReques)
        {
            RedisOption opt = new RedisOption() 
            {
                SkuName = "Premium",
                RegionName = "West US 2",
                NonSSL = true,
            };

            _redisCollection.CreateCache(redisReques.name, opt, redisReques.group);
            return Ok();
        }

    }
}
