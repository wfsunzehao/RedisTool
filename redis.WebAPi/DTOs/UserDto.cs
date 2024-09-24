using System.ComponentModel.DataAnnotations;

namespace youjun.NETDemo.WebAPi.DTOs
{
    public class UserDto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserName { get; set; }

        public string Email { get; set; }
    }
}
