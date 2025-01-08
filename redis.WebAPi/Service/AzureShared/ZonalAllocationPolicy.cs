using Azure.Core;
using Azure.ResourceManager.Redis.Models;

namespace redis.WebAPi.Service.AzureShared{
    public enum ZonalAllocationPolicy
    {
        Automatic,
        UserDefined,
        NoZones
    }
}