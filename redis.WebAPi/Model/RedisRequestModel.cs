namespace redis.WebAPi.Model
{
    public class RedisRequestModel
    {
        public string name {  get; set; }
        public string value { get; set; }
        public string subscription {  get; set; }
        public string group {  get; set; }
    }
}
