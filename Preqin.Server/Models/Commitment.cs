using System.ComponentModel.DataAnnotations;

namespace InvestorCommitments.Api.Models;

public class Commitment
{
    public int Id { get; set; }
    
    public int InvestorId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string AssetClass { get; set; } = string.Empty;
    
    public decimal Amount { get; set; }
    
    [Required]
    [MaxLength(10)]
    public string Currency { get; set; } = string.Empty;
    
    public virtual Investor Investor { get; set; } = null!;
}