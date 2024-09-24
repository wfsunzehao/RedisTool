using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using youjun.NETDemo.WebAPi.DTOs;

namespace youjun.NETDemo.WebAPi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private static List<UserDto> Users = new List<UserDto>
        {
            new UserDto { Id = 1, UserName = "User1", Email = "user1@example.com" },
            new UserDto { Id = 2, UserName = "User2", Email = "user2@example.com" }
        };

        [HttpGet("{id}")]
        public ActionResult<UserDto> Get(int id)
        {
            var user = Users.FirstOrDefault(u => u.Id == id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, UserDto updatedUser)
        {
            var user = Users.FirstOrDefault(u => u.Id == id);
            if (user == null) return NotFound();

            user.UserName = updatedUser.UserName;
            user.Email = updatedUser.Email;

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var user = Users.FirstOrDefault(u => u.Id == id);
            if (user == null) return NotFound();

            Users.Remove(user);
            return NoContent();
        }
    }
}
