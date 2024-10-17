namespace redis.WebAPi.Service.IService
{
    public interface IStackExchangeService
    {
        void AddData(string resourceGroupName, string cacheName, string port, bool ssl, long numKeysPerShard);
    }
}
