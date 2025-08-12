using System.ComponentModel.DataAnnotations;

namespace InvestorCommitments.Api.Models;

public class Investor
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Type { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Country { get; set; } = string.Empty;
    
    public DateTime DateAdded { get; set; }
    
    public DateTime LastUpdated { get; set; }
    
    public virtual ICollection<Commitment> Commitments { get; set; } = new List<Commitment>();
}