namespace redis.WebAPi.Service.IService
{
    public interface IResourceDeletionService
    {
        Task<string> DeleteResourceAsync(string subscription, string resourceGroupName);
    }
}
