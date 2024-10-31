using Microsoft.AspNetCore.Mvc;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedianController : ControllerBase
    {
        [HttpPost("sendMedianJson")]
        public IActionResult SendMedianJson([FromBody] FolderPathRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Path))
            {
                return BadRequest("The path cannot be empty");
            }

            

            return Ok(new { message = "Folder processed successfully" });
        }
    }

    public class FolderPathRequest
    {
        public string Path { get; set; }
    }
}
