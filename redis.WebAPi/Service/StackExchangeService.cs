using Azure.Core;
using Azure.Identity;
using Azure.ResourceManager;
using Azure.ResourceManager.Redis;
using redis.WebAPi.Service.AzureShared;
using redis.WebAPi.Service.IService;

namespace redis.WebAPi.Service
{
    public class StackExchangeService : IStackExchangeService
    {
        private ISubscriptionResourceService _subscriptionResourceService { get; set; }

        public StackExchangeService(ISubscriptionResourceService subscriptionResourceService) 
        {
            _subscriptionResourceService = subscriptionResourceService;
        }
        public void AddData(string resourceGroupName, string cacheName, string port, bool ssl, long numKeysPerShard)
        {
            RedisResource redis = _subscriptionResourceService.GetSubscription().GetResourceGroup(resourceGroupName).Value.GetRedis(cacheName);
            StackExchangeExtensionMethods.AddDataBulk(redis, port, ssl, numKeysPerShard);
        }
    }
}
