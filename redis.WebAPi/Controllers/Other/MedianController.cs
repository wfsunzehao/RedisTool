using Microsoft.AspNetCore.Mvc;
using redis.WebAPi.Filters;
using redis.WebAPi.Models;
using redis.WebAPi.Service.IService;
using redis.WebAPi.Service;

namespace redis.WebAPi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(AuthFilter))]
    public class MedianController : ControllerBase
    {
        private readonly IMedianService _medianService;

        public MedianController(IMedianService medianService)
        {
            _medianService = medianService;
        }

        [HttpPost("sendMedianJson")]
        public IActionResult SendMedianJson([FromBody] FolderPathRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Path))
            {
                return BadRequest("Path cannot be empty");
            }

            string baseFolderPath = request.Path;
            if (!Directory.Exists(baseFolderPath))
            {
                return BadRequest($"The specified folder {baseFolderPath} does not exist");
            }

            try
            {
                var allResults = _medianService.ProcessFolder(baseFolderPath, out var resultMessages);

                if (resultMessages.Count > 0)
                {
                    return BadRequest(new { messages = resultMessages });
                }

                var fileContent = _medianService.GenerateExcelReport(allResults);
                var fileName = "Median_Report.xlsx";
                return File(fileContent, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing the folder", details = ex.Message });
            }
        }
    }
}
