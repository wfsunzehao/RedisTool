using Microsoft.EntityFrameworkCore;
using redis.WebAPi.Model.UserModels;

namespace redis.WebAPi.Repository.AppDbContext
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options){ }
    }
}
