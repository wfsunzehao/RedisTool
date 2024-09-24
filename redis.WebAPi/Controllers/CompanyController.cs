using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using youjun.NETDemo.WebAPi.DTOs;

namespace youjun.NETDemo.WebAPi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private static List<CompanyDto> Companies = new List<CompanyDto>
        {
            new CompanyDto { Id = 1, Name = "Company A", Address = "Address A" },
            new CompanyDto { Id = 2, Name = "Company B", Address = "Address B" },
            new CompanyDto { Id = 3, Name = "Company C", Address = "Address C" },
            new CompanyDto { Id = 4, Name = "Company D", Address = "Address D" },
            new CompanyDto { Id = 5, Name = "Company E", Address = "Address E" },
            new CompanyDto { Id = 6, Name = "Company F", Address = "Address F" },
            new CompanyDto { Id = 7, Name = "Company G", Address = "Address G" }
        };

        [HttpGet]
        public ActionResult<IEnumerable<CompanyDto>> GetAll()
        {
            return Ok(Companies);
        }

        [HttpGet("{id}")]
        public ActionResult<CompanyDto> Get(int id)
        {
            var company = Companies.FirstOrDefault(c => c.Id == id);
            if (company == null) return NotFound();
            return Ok(company);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id)
        {
            CompanyDto updatedCompany = new CompanyDto { Id = 3, Name = "Company C", Address = "Address C" };
            var company = Companies.Add;
            if (company == null) return NotFound();

            company(updatedCompany);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var company = Companies.FirstOrDefault(c => c.Id == id);
            if (company == null) return NotFound();

            Companies.Remove(company);
            return NoContent();
        }
    }
}
