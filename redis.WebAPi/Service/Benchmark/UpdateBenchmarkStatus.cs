using Microsoft.EntityFrameworkCore;
using redis.WebAPi.Model;
using redis.WebAPi.Repository.AppDbContext;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace redis.WebAPi.Service
{
    public class BenchmarkService
    {
        private readonly BenchmarkDbContext _context;
        private readonly ILogger<BenchmarkService> _logger;

        // 构造函数依赖注入 BenchmarkDbContext 和 Logger
        public BenchmarkService(BenchmarkDbContext context, ILogger<BenchmarkService> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // 更新 benchmark 状态
        public async Task<bool> UpdateBenchmarkStatus(string benchmarkName, int newStatus)
        {
            try
            {
                // 查找指定名称的 benchmark 数据
                var benchmarkData = await _context.Parameters
                    .FirstOrDefaultAsync(b => b.Name == benchmarkName);

                if (benchmarkData == null)
                {
                    _logger.LogWarning($"No benchmark found with the name '{benchmarkName}'.");
                    return false; // 没有找到指定名称的 benchmark 数据
                }

                // 更新状态
                benchmarkData.Status = newStatus;

                // 保存更改到数据库
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Successfully updated the status of benchmark '{benchmarkName}' to {newStatus}.");
                return true; // 更新成功
            }
            catch (Exception ex)
            {
                // 捕获并记录异常
                _logger.LogError(ex, "An error occurred while updating the benchmark status.");
                return false;
            }
        }
    }
}
