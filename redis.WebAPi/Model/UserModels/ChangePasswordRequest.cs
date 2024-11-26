namespace redis.WebAPi.Model.UserModels
{
    public class ChangePasswordRequest
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string TargetUsername { get; set; }
    }

}
