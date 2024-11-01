using Azure;
using Azure.Core;
using redis.WebAPi.Service.IService;
using redis.WebAPi.Service.AzureShared;


namespace redis.WebAPi.Service
{
    public class ResourceDeletionService : IResourceDeletionService
    {
        private readonly AzureClientFactory _client;

        public ResourceDeletionService(AzureClientFactory client)
        {
            _client = client;
        }

        public async Task<string> DeleteResourceAsync(string subscription, string resourceGroupName)
        {
            try
            {
                var armClient = _client.ArmClient;
                var subResource = armClient.GetSubscriptionResource(new ResourceIdentifier($"/subscriptions/{subscription}"));
                var resourceGroupResource = (await subResource.GetResourceGroupAsync(resourceGroupName)).Value.GetGenericResources().ToList();

                foreach (var resource in resourceGroupResource)
                {
                    await resource.DeleteAsync(WaitUntil.Started);
                }

                return $"Delete {resourceGroupName} Successfully";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                throw; //Re-throw the exception to be handled in the controller 
            }
        }
    }
}
