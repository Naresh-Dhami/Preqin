namespace InvestorCommitments.Api.DTOs;

public class CommitmentDto
{
    public int Id { get; set; }
    public int InvestorId { get; set; }
    public string AssetClass { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
}