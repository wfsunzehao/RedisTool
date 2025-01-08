using Microsoft.EntityFrameworkCore;
using redis.WebAPi.Repository.AppDbContext;


namespace redis.WebAPi.Service
{
    public class BenchmarkService
    {
        private readonly BenchmarkDbContext _context;
        private readonly ILogger<BenchmarkService> _logger;

        // The constructor relies on injection of BenchmarkDbContext and Logger
        public BenchmarkService(BenchmarkDbContext context, ILogger<BenchmarkService> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // Update benchmark status
        public async Task<bool> UpdateBenchmarkStatus(string benchmarkName, int newStatus)
        {
            try
            {
                // Finds benchmark data for the specified name
                var benchmarkData = await _context.Parameters
                    .FirstOrDefaultAsync(b => b.Name == benchmarkName);

                if (benchmarkData == null)
                {
                    _logger.LogWarning($"No benchmark found with the name '{benchmarkName}'.");
                    return false; 
                }
                benchmarkData.Status = newStatus;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Successfully updated the status of benchmark '{benchmarkName}' to {newStatus}.");
                return true; 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating the benchmark status.");
                return false;
            }
        }
    }
}
