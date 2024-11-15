using Azure.ResourceManager.Redis;
using Microsoft.AspNetCore.Mvc;
using redis.WebAPi.Model;
using redis.WebAPi.Service.IService;

namespace redis.WebAPi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
                // Generate SubscriptionResource based on the subscriptionId passed in by the front end
                _subscriptionResourceService.SetSubscriptionResource(subscriptionId);
                List<string> redisName = new List<string>();
                foreach (var s in _subscriptionResourceService.GetSubscription().GetResourceGroup(resourceGroupName).Value.GetAllRedis())
                {
                    redisName.Add(s.Data.Name);
                }

                return Ok(redisName.ToList());
            }
            catch (Exception ex)
            {
                return BadRequest($"Error setting subscription: {ex.Message}");
            }
        }

    }
}
