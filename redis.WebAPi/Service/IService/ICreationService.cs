using redis.WebAPi.Model;

namespace redis.WebAPi.Service.IService
{
    public interface ICreationService
    {
        Task CreateCache(RedisRequestModel redisRequest);
        Task CreateManualCache(RedisRequestModel redisRequest);
        Task CreateBVTCache(RedisRequestModel redisRequest);
        Task CreateBVTCacheByCase(RedisRequestModel redisRequest);
        Task CreatePerfCache(PerfRequestModel redisRequest);
        Task CreateAltCache(PerfRequestModel redisRequest);
        Task CreateP0P1Cache(P0P1RequestModel redisRequest);
    }
}
