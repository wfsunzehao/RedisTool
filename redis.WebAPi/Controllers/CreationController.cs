using Azure.Core;
using Azure.ResourceManager;
using Microsoft.AspNetCore.Mvc;
using redis.WebAPi.Model;
using redis.WebAPi.Service;
using redis.WebAPi.Service.AzureShared;
using redis.WebAPi.Service.AzureShared.CreationFunction;
using redis.WebAPi.Service.IService;
using System.Data;
using System;

namespace redis.WebAPi.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class CreationController : ControllerBase
    {
        private readonly IRedisCollection _redisCollection;
        private readonly ISubscriptionResourceService _subscriptionResourceService;

        public CreationController(IRedisCollection redisCollection, ISubscriptionResourceService subscriptionResourceService)
        {
            this._redisCollection = redisCollection;
            this._subscriptionResourceService = subscriptionResourceService;
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

        [HttpPost("CreateBVTCache")]
        //目前PrivateEndpointBladeTest和CacheCreationTest以及EnterpriseTest需手动验证创建，不包括在此功能内
        public async Task<IActionResult> CreateBVTCache([FromBody] RedisRequestModel redisReques)
        {

            _subscriptionResourceService.SetSubscriptionResource(redisReques.subscription);

            for (int i = 0; i < BVTTestCaseName.BVTTestCaseNames.Length; i++) {
                
                string currentTestCase = BVTTestCaseName.BVTTestCaseNames[i];
                string currentDate = DateTime.Now.ToString("MMdd");

                RedisOption opt = new RedisOption();
                
                if (currentTestCase == "RebootBladeTest")
                {
                    opt = new RedisOption()
                    {
                        SkuName = "Premium",
                        RegionName = "Central US EUAP",
                        Cluster = true,
                        MaxShards = 2,
                        NonSSL = true,
                    };
                    _redisCollection.CreateCache("BVT-" + currentTestCase + "-" + currentDate, opt, redisReques.group);
                }
                else if (currentTestCase == "DataPersistenceBladeTest-NotPremium")
                {
                    opt = new RedisOption()
                    {
                        SkuName = "Basic",
                        RegionName = "Central US EUAP",
                        NonSSL = true,
                    };
                    _redisCollection.CreateCache("BVT-" + currentTestCase + "-" + currentDate, opt, redisReques.group);
                }
                else if (currentTestCase == "GeoreplicationBladeTest")
                {
                    opt = new RedisOption()
                    {
                        SkuName = "Premium",
                        RegionName = "Central US EUAP",
                        NonSSL = true,
                    };
                    _redisCollection.CreateCache("BVT-" + currentTestCase + "-CUSE-"+ currentDate, opt, redisReques.group);
                    opt = new RedisOption()
                    {
                        SkuName = "Premium",
                        RegionName = "East US",
                        NonSSL = true,
                    };
                    _redisCollection.CreateCache("BVT-" + currentTestCase + "-EUS-" + currentDate, opt, redisReques.group);
                }
                else
                {
                    opt = new RedisOption()
                    {
                        SkuName = "Premium",
                        RegionName = "Central US EUAP",
                        NonSSL = true,
                    };
                    _redisCollection.CreateCache("BVT-" + currentTestCase + "-" + currentDate, opt, redisReques.group);
                }
            }
            return Ok();
        }

    }
}
