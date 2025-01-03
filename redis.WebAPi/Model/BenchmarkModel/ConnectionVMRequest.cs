namespace redis.WebAPi.Model.BenchmarkModel
{
    public class ConnectionVMRequest
    {
        public string Name { get; set; }
        public string Primary { get; set; }
        public int Clients { get; set; }
        public int Threads { get; set; }
        public int Size { get; set; }
        public int Requests { get; set; }
        public int Pipeline { get; set; }
        public int Times { get; set; }
    }

}
