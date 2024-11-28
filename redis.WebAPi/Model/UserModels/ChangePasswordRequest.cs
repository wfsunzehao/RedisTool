namespace redis.WebAPi.Model.UserModels
{
    public class ChangePasswordRequest
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string NewPassword { get; set; }
    }


}
