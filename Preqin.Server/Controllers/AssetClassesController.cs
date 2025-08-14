using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using InvestorCommitments.Api.Services;

namespace InvestorCommitments.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[SwaggerTag("Manage asset class data")]
public class AssetClassesController : ControllerBase
{
    private readonly IInvestorService _investorService;
    private readonly ILogger<AssetClassesController> _logger;

    public AssetClassesController(IInvestorService investorService, ILogger<AssetClassesController> logger)
    {
        _investorService = investorService;
        _logger = logger;
    }

    /// <summary>
    /// Get all distinct asset classes
    /// </summary>
    /// <returns>List of unique asset classes</returns>
    /// <response code="200">Returns the list of asset classes</response>
    /// <response code="500">If there was an internal server error</response>
    [HttpGet]
    [SwaggerResponse(200, "Successfully retrieved asset classes", typeof(IEnumerable<string>))]
    [SwaggerResponse(500, "Internal server error")]
    public async Task<IActionResult> GetAssetClasses()
    {
        try
        {
            var assetClasses = await _investorService.GetAssetClassesAsync();
            return Ok(assetClasses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving asset classes");
            return StatusCode(500, new { message = "An error occurred while retrieving asset classes", error = ex.Message });
        }
    }
}