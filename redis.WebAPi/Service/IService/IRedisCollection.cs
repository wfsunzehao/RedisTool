using Azure.ResourceManager.Redis;
using redis.WebAPi.Service.AzureShared;

namespace redis.WebAPi.Service.IService
{
    public interface IRedisCollection
    {
        void CreateCache(string cacheName, RedisOption opt, string group);

    }
}
