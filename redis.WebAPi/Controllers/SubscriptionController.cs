using Microsoft.AspNetCore.Mvc;
using redis.WebAPi.Service.AzureShared;
using redis.WebAPi.Service.IService;
namespace redis.WebAPi.Controllers
{


    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionController : ControllerBase
    {

        private readonly ISubscriptionResourceService _subscriptionResourceService;

        // Injecting SubscriptionResourceService
        public SubscriptionController(ISubscriptionResourceService subscriptionResourceService)
        {
            _subscriptionResourceService = subscriptionResourceService;
        }

        // Receive the subscriptionId passed by the front end and generate SubscriptionResource
        [HttpGet]
        [HttpGet("{subscriptionId}")]
        public IActionResult SetSubscription(string subscriptionId)
        {
            try
            {
                // Generate SubscriptionResource based on the subscriptionId passed in by the front end
                _subscriptionResourceService.SetSubscriptionResource(subscriptionId);
                List<string> groupNameList = new List<string>();
                foreach (var s in _subscriptionResourceService.GetSubscription().GetResourceGroups().GetAll())
                {
                    groupNameList.Add(s.Data.Name);
                }

                return Ok(groupNameList.ToList());
            }
            catch (Exception ex)
            {
                return BadRequest($"Error setting subscription: {ex.Message}");
            }
        }

        [HttpPost("test")]
        public async Task<IActionResult> Test([FromBody] MyRequestModel model)
        {
            // Delay 10 seconds
            await Task.Delay(10000); // 10000 milliseconds = 10 seconds

            // Processing received parameters
            return Ok(new { subscription = model.subscription, group = model.group });
        }


        public class MyRequestModel
        {
            public string name { get; set; }
            public string region { get; set; }
            public string subscription { get; set; }
            public string group { get; set; }

        }

        // Example: Get a SubscriptionResource and perform some operation
        [HttpGet("getSubscriptionResource")]
        public IActionResult GetSubscriptionResource()
        {
            try
            {
                var subscriptionResource = _subscriptionResourceService.GetSubscription();
                return Ok(subscriptionResource.Data);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving subscription: {ex.Message}");
            }
        }
    }
}
