using Azure.ResourceManager;
using Azure.ResourceManager.Redis;
using redis.WebAPi.Service.IService;
using Azure.ResourceManager.Resources;
using redis.WebAPi.Service.AzureShared.CreationFunction;
using redis.WebAPi.Service.AzureShared;

namespace redis.WebAPi.Service
{
    public class RedisCollectionService : IRedisCollection
    {

        private ISubscriptionResourceService _subscriptionResourceService { get; set; }

        public RedisCollectionService(ISubscriptionResourceService subscriptionResourceService)
        {
            _subscriptionResourceService = subscriptionResourceService;
        }
        public RedisCollection GetRedisCollection(string groupName)
        {
            var redisCollection = _subscriptionResourceService.GetSubscription().GetResourceGroup(groupName).Value.GetAllRedis();
            return redisCollection;
        }

        async void IRedisCollection.CreateCache(string cacheName, RedisOption opt , string group)
        {
            var redisCollection = GetRedisCollection( group);
            await BaseCreation.CreateRedisResource(cacheName,opt, redisCollection);
        }

    }
}
