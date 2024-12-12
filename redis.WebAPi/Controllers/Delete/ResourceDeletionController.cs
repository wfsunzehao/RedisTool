using Azure.ResourceManager.Redis;
using Azure.ResourceManager.RedisEnterprise;
using Microsoft.AspNetCore.Mvc;
using redis.WebAPi.Filters;
using redis.WebAPi.Model;
using redis.WebAPi.Service.IService;

namespace redis.WebAPi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(AuthFilter))]
    public class ResourceDeletionController : ControllerBase
    {
        private readonly IResourceDeletionService _resourceDeletionService;

        private readonly ISubscriptionResourceService _subscriptionResourceService;

        public ResourceDeletionController(IResourceDeletionService resourceDeletionService, ISubscriptionResourceService subscriptionResourceService)
        {
            _resourceDeletionService = resourceDeletionService;
            _subscriptionResourceService = subscriptionResourceService; 
        }

        [HttpDelete("DeleteResource")]
        public async Task<IActionResult> DeleteResource([FromBody] DeleteResourceRequest request)
        {
            try
            {
                var result = await _resourceDeletionService.DeleteResourceAsync(request.Subscription, request.ResourceGroupName);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while deleting resources.");
            }
        }


        [HttpGet("{subscriptionId}/{resourceGroupName}")]
        public async Task<IActionResult> ShowResource(string subscriptionId, string resourceGroupName)
        {
            try
            {
                _subscriptionResourceService.SetSubscriptionResource(subscriptionId);
                Dictionary<string,string> cacheInfo = new Dictionary<string, string>();
                foreach (var s in _subscriptionResourceService.GetSubscription().GetResourceGroup(resourceGroupName).Value.GetAllRedis())
                {
                    cacheInfo.Add(s.Data.Name,s.Data.Sku.Name.ToString());
                }

                foreach (var i in _subscriptionResourceService.GetSubscription().GetResourceGroup(resourceGroupName).Value.GetRedisEnterpriseClusters())
                {
                    cacheInfo.Add(i.Data.Name, i.Data.Sku.Name.ToString());
                }

                return Ok(cacheInfo);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

    }
}
