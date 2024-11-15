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
using Azure.ResourceManager.Redis.Models;
using Azure.ResourceManager.Storage;
using Azure.ResourceManager.Resources.Models;
using Azure.ResourceManager.Resources;
using Azure.Core.GeoJson;
using Azure;
using Azure.ResourceManager.Network;
using Azure.ResourceManager.Network.Models;
using Azure.ResourceManager.RedisEnterprise;
using Microsoft.Identity.Client;

namespace redis.WebAPi.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class CreationController : ControllerBase
    {
        private readonly IRedisCollection _redisCollection;
        private readonly IAzureClient _azureClient;
        private readonly ISubscriptionResourceService _subscriptionResourceService;

        private static Random random = new Random();

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
        //Currently, PrivateEndpointBladeTest, CacheCreationTest, and EnterpriseTest 
        //need to be manually verified and created, and are not included in this feature.
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

        [HttpPost("CreateBVTCacheByCase")]
        //Currently, PrivateEndpointBladeTest, CacheCreationTest, and EnterpriseTest 
        //need to be manually verified and created, and are not included in this feature.
        public async Task<IActionResult> CreateBVTCacheByCase([FromBody] RedisRequestModel redisReques)
        {
            if (redisReques.Cases == null || redisReques.Cases.Length == 0)
            {
                throw new InvalidOperationException("Cases cannot be null or empty.");
            }

            if (redisReques.Quantity != null && redisReques.Cases.Length == 1)
            {
                string caseToCopy = redisReques.Cases[0]; // Get the case to be copied
                int quantity = int.Parse(redisReques.Quantity.ToString()); // to an integer
                redisReques.Cases = Enumerable.Repeat(caseToCopy, quantity).ToArray(); // Copy the specified quantity and replace the original array
            }

            _subscriptionResourceService.SetSubscriptionResource(redisReques.subscription);

            foreach (var currentTestCase in redisReques.Cases)
            {
                string currentDate = DateTime.Now.ToString("MMdd");
                int randomNumber = GenerateFourDigitRandomNumber();
                
                RedisOption opt = new RedisOption();

                switch (currentTestCase)
                {
                    case "RebootBladeTest":
                        opt.SkuName = "Premium";
                        opt.RegionName = "Central US EUAP";
                        opt.Cluster = true;
                        opt.MaxShards = 2;
                        opt.NonSSL = true;
                        break;

                    case "DataPersistenceBladeTest-NotPremium":
                        opt.SkuName = "Basic";
                        opt.RegionName = "Central US EUAP";
                        opt.NonSSL = true;
                        break;

                    case "GeoreplicationBladeTest":
                        // Create two caching options
                        opt.SkuName = "Premium";
                        opt.RegionName = "Central US EUAP";
                        opt.NonSSL = true;
                        _redisCollection.CreateCache($"BVT-{currentTestCase}-{currentDate}-CUSE-{randomNumber}", opt, redisReques.group);
                        //another option
                        opt.RegionName = "East US";
                        _redisCollection.CreateCache($"BVT-{currentTestCase}-{currentDate}-EUS-{randomNumber}", opt, redisReques.group);
                        continue; // Continue the loop to avoid duplicate creation

                    default:
                        opt.SkuName = "Premium";
                        opt.RegionName = "Central US EUAP";
                        opt.NonSSL = true;
                        break;
                }

                _redisCollection.CreateCache($"BVT-{currentTestCase}-{currentDate}-{randomNumber}", opt, redisReques.group);
            }

            return Ok();
        }
        [HttpPost("CreatePerfCache")]
        public async Task<IActionResult> CreatePerfCache([FromBody] PerfRequestModel redisReques){
            string RegionName_1 = "East US 2 EUAP";
            string formattedDate = DateTime.Now.ToString("MMdd");

            _subscriptionResourceService.SetSubscriptionResource(redisReques.Subscription);
            if (redisReques.Sku == "All" || redisReques.Sku == "Premium")
            {
                for (int i = 1; i <= 5; i++)
                {
                    RedisOption opt = new RedisOption() 
                    {
                        SkuName = "Premium",
                        RegionName = RegionName_1,
                        SkuCapacity = i,
                        NonSSL = true,
                    };
                _redisCollection.CreateCache("Verifyperformance-P" + i + "-EUS2E" + "-" + formattedDate, opt, redisReques.Group);
                }
            }
            if (redisReques.Sku == "All" || redisReques.Sku == "Standard")
            {
                for (int i = 0; i <= 6; i++)
                {
                    RedisOption opt = new RedisOption() 
                    {
                        SkuName = "Standard",
                        RegionName = RegionName_1,
                        SkuCapacity = i,
                        NonSSL = true,
                    };
                _redisCollection.CreateCache("Verifyperformance-C" + i + "-EUS2E-Standard" + "-" + formattedDate, opt, redisReques.Group);
                }
            }
            if (redisReques.Sku == "All" || redisReques.Sku == "Basic")
            {
                for (int i = 0; i <= 6; i++)
                {
                    RedisOption opt = new RedisOption() 
                    {
                        SkuName = "Basic",
                        RegionName = RegionName_1,
                        SkuCapacity = i,
                        NonSSL = true,
                    };
                _redisCollection.CreateCache("Verifyperformance-C" + i + "-EUS2E-Basic" + "-" + formattedDate, opt, redisReques.Group);
                
                }
            }
            // Processing received parameters
            return Ok();
        }
        [HttpPost("CreateAltCache")]
        public async Task<IActionResult> CreateAltCache([FromBody] PerfRequestModel redisReques){
            string RegionName_1 = "East US 2 EUAP";
            string formattedDate = DateTime.Now.ToString("MMdd");

            _subscriptionResourceService.SetSubscriptionResource(redisReques.Subscription);
            if (redisReques.Sku == "All" || redisReques.Sku == "Premium")
            {
                for (int i = 1; i <= 5; i++)
                {
                    RedisOption opt = new RedisOption() 
                    {
                        SkuName = "Premium",
                        RegionName = RegionName_1,
                        SkuCapacity = i,
                        NonSSL = true,
                    };
                _redisCollection.CreateCache("Alt-eus2e-P" + i + "-" + formattedDate, opt, redisReques.Group);
                }
            }
            if (redisReques.Sku == "All" || redisReques.Sku == "Standard")
            {
                for (int i = 0; i <= 6; i++)
                {
                    RedisOption opt = new RedisOption() 
                    {
                        SkuName = "Standard",
                        RegionName = RegionName_1,
                        SkuCapacity = i,
                        NonSSL = true,
                    };
                _redisCollection.CreateCache("Alt-eus2e-SC" + i + "-" + formattedDate, opt, redisReques.Group);
                }
            }
            if (redisReques.Sku == "All" || redisReques.Sku == "Basic")
            {
                for (int i = 0; i <= 6; i++)
                {
                    RedisOption opt = new RedisOption() 
                    {
                        SkuName = "Basic",
                        RegionName = RegionName_1,
                        SkuCapacity = i,
                        NonSSL = true,
                    };
                _redisCollection.CreateCache("Alt-eus2e-BC" + i + "-" + formattedDate, opt, redisReques.Group);
                
                }
            }
            // Processing received parameters
            return Ok();
        }
        [HttpPost("CreateP0P1Cache")]
        //25064413, 26639809, and 15379626 need to be created by yourself.
        public async Task<IActionResult> CreateP0P1Cache([FromBody] P0P1RequestModel redisReques)
        {

            _subscriptionResourceService.SetSubscriptionResource(redisReques.subscription);
            
            ResourceGroupResource resourceGroupResource = await _subscriptionResourceService.GetSubscription().GetResourceGroupAsync(redisReques.group);

            var connectionString = StorageAccountCreation.CreateStorageAccountAsync(redisReques.region, resourceGroupResource).Result;

            VirtualNetworkResource virtualNetwork = VirtualNetworkCreation.CreateVirtualNetWorkResourceAsync(redisReques.region, resourceGroupResource).Result;

            string currentDate = DateTime.Now.ToString("MMdd");

            List<Task> tasks = new List<Task>();
            foreach (var opt in P0P1ManualCacheModel.opt)
            {
                tasks.Add(Task.Run(() =>
                {
                    if (redisReques.region == "Central US EUAP" && opt.Zones != null)
                    {
                        return;
                    }

                    bool ifPrivateLink = false;
                    bool ifGeo = false;
                    foreach (var tag in opt.Tag)
                    {
                        if (tag == "AOF")
                        {
                            opt.redisCommonConfiguration.IsAofBackupEnabled = true;
                            opt.redisCommonConfiguration.AofStorageConnectionString0 = connectionString;
                        }
                        if (tag == "Vnet")
                        {
                            opt.SubnetId = virtualNetwork.Data.Subnets[0].Id;
                        }
                        if (tag == "PrivateLink")
                        {
                            ifPrivateLink = true;
                        }
                        if (tag == "Geo")
                        {
                            ifGeo = true;
                        }
                    }
                    opt.RegionName = redisReques.region;
                    string cacheName = "Manual-Test-" + opt.Tag[0] + redisReques.region.Replace(" ", "") + currentDate;
                    _redisCollection.CreateCache(cacheName, opt, redisReques.group);

                    string cacheName2;
                    if (ifGeo == true && redisReques.region == "Central US EUAP")
                    {
                        opt.RegionName = "East US";
                        cacheName2 = "Manual-Test-" + opt.Tag[0] + redisReques.region.Replace(" ", "") + currentDate;
                        _redisCollection.CreateCache(cacheName2, opt, redisReques.group);
                    }
                    else
                    {
                        opt.RegionName = "Southeast Asia";
                        cacheName2 = "Manual-Test-" + opt.Tag[0] + redisReques.region.Replace(" ", "") + currentDate;
                        _redisCollection.CreateCache(cacheName2, opt, redisReques.group);
                    }
                }));
            }
            var redisEnterpriseCC = resourceGroupResource.GetRedisEnterpriseClusters();

            List<Task> tasks1 = new List<Task>();
            foreach (var entOpt in P0P1ManualCacheModel.EntOpt)
            {
                tasks1.Add(Task.Run(async () =>
                {
                    string cacheNameEnt = entOpt.Tag[0] + redisReques.region.Replace(" ", "") + currentDate;
                    RedisEnterpriseClusterResource EnterpriseCache = await EnterpriseCreation.CreateRedisEnterpriseCacheAsync(redisReques, entOpt,
                    cacheNameEnt,
                    redisEnterpriseCC);
                }));
            }

        return Ok();
        }
        private static int GenerateFourDigitRandomNumber()
        {
            return random.Next(1000, 10000); // Generate random numbers between 1000 and 9999
        }
    }
}
