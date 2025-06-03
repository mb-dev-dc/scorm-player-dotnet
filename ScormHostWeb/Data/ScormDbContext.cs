using Microsoft.EntityFrameworkCore;
using ScormHost.Web.Data.Models;

namespace ScormHost.Web.Data
{
    public class ScormDbContext : DbContext
    {
        public ScormDbContext(DbContextOptions<ScormDbContext> options) : base(options) { }
        public DbSet<ScormCourse> Courses { get; set; }
        public DbSet<ScormSco> SCOs { get; set; }
        public DbSet<ScormAttempt> Attempts { get; set; }
        public DbSet<ScormUser> Users { get; set; }
    }
}
