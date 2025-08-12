using Microsoft.EntityFrameworkCore;
using InvestorCommitments.Api.Models;

namespace InvestorCommitments.Api.Data;

public class InvestorDbContext : DbContext
{
    public InvestorDbContext(DbContextOptions<InvestorDbContext> options) : base(options)
    {
    }

    public DbSet<Investor> Investors { get; set; }
    public DbSet<Commitment> Commitments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Investor entity
        modelBuilder.Entity<Investor>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Country).IsRequired().HasMaxLength(100);
            entity.Property(e => e.DateAdded).IsRequired();
            entity.Property(e => e.LastUpdated).IsRequired();
        });

        // Configure Commitment entity
        modelBuilder.Entity<Commitment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.AssetClass).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Currency).IsRequired().HasMaxLength(10);

            // Configure relationship
            entity.HasOne(e => e.Investor)
                  .WithMany(i => i.Commitments)
                  .HasForeignKey(e => e.InvestorId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}