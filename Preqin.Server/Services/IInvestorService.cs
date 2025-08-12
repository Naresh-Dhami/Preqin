using InvestorCommitments.Api.DTOs;

namespace InvestorCommitments.Api.Services;

public interface IInvestorService
{
    Task<List<InvestorDto>> GetInvestorsAsync();
    Task<List<CommitmentDto>> GetInvestorCommitmentsAsync(int investorId, string? assetClass);
    Task<List<string>> GetAssetClassesAsync();
    Task SeedDataFromCsvAsync();
}