using System.ComponentModel.DataAnnotations;

namespace youjun.NETDemo.WebAPi.DTOs
{
    public class CompanyDto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Address { get; set; }
    }
}
