using Microsoft.EntityFrameworkCore;
using InvestorCommitments.Api.Data;
using InvestorCommitments.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<InvestorDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
                           "Data Source=investorcommitments.db";
    options.UseSqlite(connectionString);
});
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<IInvestorService, InvestorService>();

// Add Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS services and policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", corsBuilder =>
    {
        corsBuilder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
    });
});

var app = builder.Build();

// Enable Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = string.Empty; // So Swagger is available at the root URL
});

// Enable CORS for all
app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
