namespace redis.WebAPi.Model
{
     public class BenchmarkData1
        {
            public string CacheName { get; set; }
            public double TotalDuration { get; set; }
            public string TimeUnit { get; set; }
            public double GetsRPS { get; set; }
            public double GetsAverageLatency { get; set; }
            public double GetsP50 { get; set; }
            public double GetsP99 { get; set; }
            public double GetsP99_90 { get; set; }
            public double GetsP99_99 { get; set; }
            public string TimeStamp { get; set; }
            public int ID { get; set; }
    }
    public class FinalBenchmarkData
    {
            public int Id { get; set; }
            public string CacheName { get; set; }
            public double TotalDuration { get; set; }
            public string TimeUnit { get; set; }
            public double GetsRPS { get; set; }
            public double GetsAverageLatency { get; set; }
            public double GetsP50 { get; set; }
            public double GetsP99 { get; set; }
            public double GetsP99_90 { get; set; }
            public double GetsP99_99 { get; set; }
    }

}