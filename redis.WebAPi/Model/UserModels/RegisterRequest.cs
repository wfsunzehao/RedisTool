namespace redis.WebAPi.Model.UserModels
{
    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string? Role { get; set; } // 可选，默认值为 'user'
    }
}
