using Microsoft.EntityFrameworkCore;
using redis.WebAPi.Model;

namespace redis.WebAPi.Repository.AppDbContext{
    public class BenchmarkDbContext : DbContext
    {
        public BenchmarkDbContext(DbContextOptions<BenchmarkDbContext> options)
            : base(options)
        {
        }

        public DbSet<Parameters> Parameters { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // 如果实体没有主键，并且是仅用于查询的，可以使用 HasNoKey
            modelBuilder.Entity<Parameters>()
                 .HasKey(p => p.Id); // 标记该实体没有主键，适用于仅查询的情况
        }
        public DbSet<FinalBenchmarkData> BenchmarkData1 { get; set; }
        public DbSet<FinalBenchmarkData> FinalBenchmarkData { get; set; }
    }
}