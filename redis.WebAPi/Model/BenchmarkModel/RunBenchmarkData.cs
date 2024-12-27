namespace redis.WebAPi.Model{
public class Parameters
{
        public int ID { get; set; }
        public string Name { get; set; }
        public string Region { get; set; }
        public string Description { get; set; }
        public int Clients { get; set; }
        public int Threads { get; set; }
        public int Size { get; set; }
        public int Requests { get; set; }
        public int Pipeline { get; set; }
        public int Times { get; set; }
        public int Status { get; set; }
}
public class RunBenchmarkData
{
        public string Name { get; set; }
        public string Primary { get; set; }
        public string Region { get; set; }
        public string Description { get; set; }
        public int Clients { get; set; }
        public int Threads { get; set; }
        public int Size { get; set; }
        public int Requests { get; set; }
        public int Pipeline { get; set; }
        public int Times { get; set; }
}

}



