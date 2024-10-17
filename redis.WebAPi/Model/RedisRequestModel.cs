namespace redis.WebAPi.Model
{
    public class RedisRequestModel
    {
        public string name {  get; set; }
        public string region { get; set; }
        public string subscription {  get; set; }
        public string group {  get; set; }
        public bool ssl { get; set; }
        public string port { get; set; }
        public long numKeysPerShard { get; set; }
    }
}
