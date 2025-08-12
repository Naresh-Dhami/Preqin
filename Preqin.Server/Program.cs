using Microsoft.EntityFrameworkCore;
using InvestorCommitments.Api.Data;
using InvestorCommitments.Api.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:7000", "https://localhost:7001");

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "Investor Commitments API",
        Version = "v1",
        Description = "A comprehensive API for managing investor commitments and related data"
    });
});

builder.Services.AddDbContext<InvestorDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
                           "Data Source=investorcommitments.db";
    options.UseSqlite(connectionString);
});

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<IInvestorService, InvestorService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", corsBuilder =>
    {
        corsBuilder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
    });
});

if (builder.Environment.IsDevelopment())
{
    builder.Logging.AddDebug();
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Investor Commitments API v1");
    });
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();



//// Ensure database is created and seed data
//using (var scope = app.Services.CreateScope())
//{
//    try
//    {
//        var context = scope.ServiceProvider.GetRequiredService<InvestorDbContext>();
//        var investorService = scope.ServiceProvider.GetRequiredService<IInvestorService>();
//        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

//        logger.LogInformation("Ensuring database is created...");
//        await context.Database.EnsureCreatedAsync();

//        logger.LogInformation("Seeding data from CSV...");
//        await investorService.SeedDataFromCsvAsync();

//        logger.LogInformation("Database initialization completed successfully.");
//    }
//    catch (Exception ex)
//    {
//        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
//        logger.LogError(ex, "An error occurred while initializing the database.");

//        // Don't throw in production, just log the error
//        if (app.Environment.IsDevelopment())
//        {
//            throw;
//        }
//    }
//}


app.Run();
