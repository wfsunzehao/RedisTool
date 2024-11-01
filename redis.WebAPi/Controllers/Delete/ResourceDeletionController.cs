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

        public ResourceDeletionController(IResourceDeletionService resourceDeletionService)
        {
            _resourceDeletionService = resourceDeletionService;
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
    }
}
