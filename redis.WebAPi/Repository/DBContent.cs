using Microsoft.EntityFrameworkCore;
using redis.WebAPi.Model;
using redis.WebAPi.Model.BenchmarkModel;
using redis.WebAPi.Model.UserModels;

namespace redis.WebAPi.Repository{
    public class DBContent : DbContext
    {
        public DBContent(DbContextOptions<DBContent> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<BenchmarkRequestModel>()
                .ToTable("BenchmarkRequest", schema: "dbo")
                .HasKey(p => p.Id);


            // BenchmarkResultData ӳ�䵽 BenchmarkResultData
            modelBuilder.Entity<BenchmarkResultData>()
                .ToTable("BenchmarkResultData", schema: "dbo");

            modelBuilder.Entity<BenchmarkFinalDataModel>()
                .ToTable("BenchmarkFinalData", schema: "dbo");

            modelBuilder.Entity<BenchmarkQueueDataModel>()
               .ToTable("BenchmarkQueue", schema: "dbo");

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

        }
        public DbSet<BenchmarkResultData> BenchmarkResultData { get; set; }
        public DbSet<BenchmarkFinalDataModel> BenchmarkFinalData { get; set; }
        public DbSet<BenchmarkRequestModel> BenchmarkRequest { get; set; }
        public DbSet<BenchmarkQueueDataModel> BenchmarkQueue { get; set; }
        public DbSet<User> Users { get; set; }
    }
}