using Microsoft.EntityFrameworkCore;
using redis.WebAPi.Model;
using redis.WebAPi.Model.BenchmarkModel;
using redis.WebAPi.Repository.AppDbContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace redis.WebAPi.Service.Benchmark
{
    // Rename class to match constructor and class name
    public class InsertBenchmarkService 
    {
        private readonly BenchmarkDbContext _context;

        public InsertBenchmarkService(BenchmarkDbContext context)
        {
            _context = context;
        }

        // 插入解析后的数据
        public async Task InsertBenchmarkData(string output, string cacheName, string timeStamp)
        {
            try
            {
                // 提取所有的 Entry 区块
                var entries = ExtractEntries(output);

                // 遍历每个 Entry，生成 BenchmarkData1 对象并插入到数据库
                foreach (var entry in entries)
                {
                    var BenchmarkData1 = new BenchmarkData1
                    {
                        CacheName = cacheName,
                        TotalDuration = entry.TotalDuration,
                        TimeUnit = entry.TimeUnit,
                        GetsRPS = entry.GetsRPS,
                        GetsAverageLatency = entry.GetsAverageLatency,
                        GetsP50 = entry.GetsP50,
                        GetsP99 = entry.GetsP99,
                        GetsP99_90 = entry.GetsP99_90,
                        GetsP99_99 = entry.GetsP99_99,
                        TimeStamp = timeStamp
                    };

                    // 插入数据到数据库
                    await _context.BenchmarkData1.AddAsync(BenchmarkData1);
                }

                // 保存到数据库
                await _context.SaveChangesAsync();
                Console.WriteLine("Benchmark data inserted successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inserting benchmark data: {ex.Message}");
            }
        }

        // 提取 Entry 的数据
        private List<BenchmarkEntry> ExtractEntries(string output)
        {
            var entries = new List<BenchmarkEntry>();

            // 正则表达式用于提取每个 Entry 的相关数据
            var entryPattern = new Regex(@"Entry (\d+):.*?Total duration: (\d+)\s*.*?Time unit: (\w+).*?Gets RPS: ([\d\.]+).*?Gets average latency: ([\d\.]+).*?Gets p50\.00: ([\d\.]+).*?Gets p99\.00: ([\d\.]+).*?Gets p99\.90: ([\d\.]+).*?Gets p99\.99: ([\d\.]+)", RegexOptions.Singleline);

            var matches = entryPattern.Matches(output);

            foreach (Match match in matches)
            {
                var entry = new BenchmarkEntry
                {
                    TotalDuration = double.Parse(match.Groups[2].Value),
                    TimeUnit = match.Groups[3].Value,
                    GetsRPS = double.Parse(match.Groups[4].Value),
                    GetsAverageLatency = double.Parse(match.Groups[5].Value),
                    GetsP50 = double.Parse(match.Groups[6].Value),
                    GetsP99 = double.Parse(match.Groups[7].Value),
                    GetsP99_90 = double.Parse(match.Groups[8].Value),
                    GetsP99_99 = double.Parse(match.Groups[9].Value)
                };
                entries.Add(entry);
            }

            return entries;
        }
    }

    // 将 BenchmarkEntry 提取到类外部作为普通类
    public class BenchmarkEntry
    {
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
