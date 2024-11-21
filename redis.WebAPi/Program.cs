using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.SignalR;
using redis.WebAPI.Controllers.Create;
using redis.WebAPi.Service;
using redis.WebAPi.Service.AzureShared;
using redis.WebAPi.Service.IService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//Add SignalR service
builder.Services.AddSignalR();
//Add configuration 0909
builder.Services.AddCors();

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
builder.Host.ConfigureContainer<ContainerBuilder>(containerBuilder =>
{

    // Register ArmClientFactory and pass the subscription ID from the configuration
    containerBuilder.Register(c =>
    {
        
        return new AzureClientFactory();
    }).SingleInstance();

    // Registration of SubscriptionResourceService, delayed generation of SubscriptionResource
    containerBuilder.RegisterType<SubscriptionResourceService>().As<ISubscriptionResourceService>().SingleInstance();

    containerBuilder.RegisterType<RedisCollectionService>().As<IRedisCollection>().SingleInstance();

    containerBuilder.RegisterType<StackExchangeService>().As<IStackExchangeService>().SingleInstance();

    containerBuilder.RegisterType<ResourceDeletionService>().As<IResourceDeletionService>().SingleInstance();

});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(opt=> 
    {
        //Allow all sources
        //opt=> .AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()
        //Allowed to specify sources
        opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000").AllowCredentials(); ;
        opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://172.29.20.156:3000");
    });

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapHub<CreateHub>("/createHub");

app.MapControllers();

app.Run();
