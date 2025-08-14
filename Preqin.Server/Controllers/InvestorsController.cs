using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using InvestorCommitments.Api.Services;

namespace InvestorCommitments.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[SwaggerTag("Manage investor data and commitments")]
public class InvestorsController : ControllerBase
{
    private readonly IInvestorService _investorService;
    private readonly ILogger<InvestorsController> _logger;

    public InvestorsController(IInvestorService investorService, ILogger<InvestorsController> logger)
    {
        _investorService = investorService;
        _logger = logger;
    }

    /// <summary>
    /// Get all investors
    /// </summary>
    /// <returns>List of investors with total commitments</returns>
    /// <response code="200">Returns the list of investors</response>
    /// <response code="500">If there was an internal server error</response>
    [HttpGet]
    [SwaggerResponse(200, "Successfully retrieved investors", typeof(IEnumerable<object>))]
    [SwaggerResponse(500, "Internal server error")]
    public async Task<IActionResult> GetInvestors()
    {
        try
        {
            var result = await _investorService.GetInvestorsAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving investors");
            return StatusCode(500, new { message = "An error occurred while retrieving investors", error = ex.Message });
        }
    }

    /// <summary>
    /// Get all commitments for a specific investor
    /// </summary>
    /// <param name="id">Investor ID</param>
    /// <param name="assetClass">Optional asset class filter</param>
    /// <returns>List of commitments for the investor</returns>
    /// <response code="200">Returns the commitments for the investor</response>
    /// <response code="404">If no commitments found for the investor</response>
    /// <response code="500">If there was an internal server error</response>
    [HttpGet("commitments/{id}")]
    [SwaggerResponse(200, "Successfully retrieved commitments", typeof(IEnumerable<object>))]
    [SwaggerResponse(404, "No commitments found for the investor")]
    [SwaggerResponse(500, "Internal server error")]
    public async Task<IActionResult> GetInvestorCommitments(
        int id,
        [FromQuery] string? assetClass = null)
    {
        try
        {
            var commitments = await _investorService.GetInvestorCommitmentsAsync(id, assetClass);          

            return Ok(commitments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving commitments for investor {InvestorId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving commitments", error = ex.Message });
        }
    }
}