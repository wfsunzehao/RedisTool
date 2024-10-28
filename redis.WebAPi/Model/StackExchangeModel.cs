namespace redis.WebAPi.Model
{
    public class StackExchangeModel
    {
        public string Name { get; set; }
        public string Group { get; set; }
        public string Subscription { get; set; }
        public bool Ssl { get; set; }
        public string Port { get; set; }
        public long NumKeysPerShard { get; set; }
    }
}
