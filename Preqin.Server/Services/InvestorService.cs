using Microsoft.EntityFrameworkCore;
using AutoMapper;
using InvestorCommitments.Api.Data;
using InvestorCommitments.Api.DTOs;
using InvestorCommitments.Api.Models;
using CsvHelper;
using CsvHelper.Configuration.Attributes;
using System.Globalization;

namespace InvestorCommitments.Api.Services;

public class InvestorService : IInvestorService
{
    private readonly InvestorDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<InvestorService> _logger;

    public InvestorService(InvestorDbContext context, IMapper mapper, ILogger<InvestorService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<List<InvestorDto>> GetInvestorsAsync()
    {
        var investors = await _context.Investors
            .Include(i => i.Commitments)
            .ToListAsync();
        
        return _mapper.Map<List<InvestorDto>>(investors);
    }

    public async Task<List<CommitmentDto>> GetInvestorCommitmentsAsync(int investorId, string? assetClass)
    {
        var query = _context.Commitments.Where(c => c.InvestorId == investorId);

        if (!string.IsNullOrWhiteSpace(assetClass))
        {
            query = query.Where(c => c.AssetClass == assetClass);
        }

        var commitments = await query.ToListAsync();
        return _mapper.Map<List<CommitmentDto>>(commitments);
    }

    public async Task<List<string>> GetAssetClassesAsync()
    {
        return await _context.Commitments
            .Select(c => c.AssetClass)
            .Distinct()
            .OrderBy(ac => ac)
            .ToListAsync();
    }

    public async Task SeedDataFromCsvAsync()
    {
        if (await _context.Investors.AnyAsync())
        {
            _logger.LogInformation("Database already contains data. Skipping CSV import.");
            return;
        }

        var csvPath = Path.Combine(Directory.GetCurrentDirectory(), "data.csv");
        if (!File.Exists(csvPath))
        {
            // Try looking in the parent directory (solution root)
            csvPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "data.csv");
        }
        if (!File.Exists(csvPath))
        {
            _logger.LogWarning("CSV file not found at {CsvPath}. Skipping data import.", csvPath);
            return;
        }

        try
        {
            using var reader = new StringReader(await File.ReadAllTextAsync(csvPath));
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
            
            var records = csv.GetRecords<CsvRecord>().ToList();
            var investorDict = new Dictionary<string, Investor>();

            foreach (var record in records)
            {
                if (!investorDict.ContainsKey(record.InvestorName))
                {
                    // Parse dates from CSV
                    DateTime dateAdded = DateTime.UtcNow;
                    DateTime lastUpdated = DateTime.UtcNow;
                    
                    if (DateTime.TryParse(record.InvestorDateAdded, out var parsedDateAdded))
                        dateAdded = parsedDateAdded;
                    
                    if (DateTime.TryParse(record.InvestorLastUpdated, out var parsedLastUpdated))
                        lastUpdated = parsedLastUpdated;

                    var investor = new Investor
                    {
                        Name = record.InvestorName,
                        Type = record.InvestoryType,
                        Country = record.InvestorCountry,
                        DateAdded = dateAdded,
                        LastUpdated = lastUpdated
                    };
                    
                    investorDict[record.InvestorName] = investor;
                    _context.Investors.Add(investor);
                }

                var commitment = new Commitment
                {
                    Investor = investorDict[record.InvestorName],
                    AssetClass = record.CommitmentAssetClass,
                    Amount = record.CommitmentAmount,
                    Currency = record.CommitmentCurrency
                };

                _context.Commitments.Add(commitment);
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation("Successfully imported {RecordCount} records from CSV.", records.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error importing data from CSV file.");
            throw;
        }
    }

    private class CsvRecord
    {
        [Name("Investor Name")]
        public string InvestorName { get; set; } = string.Empty;
        
        [Name("Investory Type")]
        public string InvestoryType { get; set; } = string.Empty;
        
        [Name("Investor Country")]
        public string InvestorCountry { get; set; } = string.Empty;
        
        [Name("Investor Date Added")]
        public string InvestorDateAdded { get; set; } = string.Empty;
        
        [Name("Investor Last Updated")]
        public string InvestorLastUpdated { get; set; } = string.Empty;
        
        [Name("Commitment Asset Class")]
        public string CommitmentAssetClass { get; set; } = string.Empty;
        
        [Name("Commitment Amount")]
        public decimal CommitmentAmount { get; set; }
        
        [Name("Commitment Currency")]
        public string CommitmentCurrency { get; set; } = string.Empty;
    }
}