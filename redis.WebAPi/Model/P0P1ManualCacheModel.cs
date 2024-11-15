using Azure.ResourceManager.RedisEnterprise.Models;
using redis.WebAPi.Service.AzureShared;

namespace redis.WebAPi.Model
{
    //25064413, 26639809, and 15379626 need to be created by yourself
    public class P0P1ManualCacheModel
    {
        public static readonly RedisOption[] opt = new RedisOption[19]
        {
            new RedisOption //15318672-Standard
            {
                SkuName = "Standard",
                NonSSL = true,
                Tag = new List<string> { "15318672-S" }
            },
            
            new RedisOption //15318673-EUS2E-ToBeDeleted
            {
                SkuName = "Premium",
                NonSSL = true,
                Zones = new List<string> { "1" , "2" },
                Tag = new List<string> { "15318673-Deleted" }
            },
            new RedisOption //15318673-EUS2E
            {
                SkuName = "Premium",
                NonSSL = true,
                Zones = new List<string> { "1", "2","3" },
                ReplicasPerPrimary = 2,
                Tag = new List<string> { "15318673" }
            },
            new RedisOption //15318674-Vnet
            {
                SkuName = "Premium",
                NonSSL = true,
                Tag = new List<string> { "15318674" , "Vnet"}
            },
            new RedisOption //15318675
            {
                SkuName = "Premium",
                NonSSL = true,
                Tag = new List<string> { "15318675" }
            },
            new RedisOption //15319070-CUSE/EUS2E
            {
                SkuName = "Premium",
                NonSSL = true,
                Cluster = true,
                Tag = new List<string> { "15319070" }
            },
            new RedisOption //15319116
            {
                SkuName = "Premium",
                NonSSL = true,
                Cluster = true,
                ReplicasPerPrimary = 2,
                MinShards = 2,
                Tag = new List<string> { "15319116" }
            },
            new RedisOption //15320703-Geo
            {
                SkuName = "Premium",
                NonSSL = true,
                Tag = new List<string> { "15320703", "Geo" }
            },
            new RedisOption //15379626-PrivateLink
            {
                SkuName = "Premium",
                NonSSL = true,
                Tag = new List<string> { "15379626", "PrivateLink" }
            },
            new RedisOption //15379676
            {
                SkuName = "Premium",
                NonSSL = true,
                Cluster = true,
                MinShards = 2,
                Tag = new List<string> { "15379676" }
            },
            new RedisOption //15379764-AOF-Vnet
            {
                SkuName = "Premium",
                NonSSL = true,
                Cluster = true,
                Tag = new List<string> { "15379764", "AOF" , "Vnet" }
            },
            new RedisOption //15379484
            {
                SkuName = "Premium",
                NonSSL = true,
                Tag = new List<string> { "15379484" }
            },
            new RedisOption //15379874-vnet
            {
                SkuName = "Premium",
                NonSSL = true,
                Cluster = true,
                ReplicasPerPrimary = 3,
                Tag = new List<string> { "15379874", "Vnet" }
            },
            new RedisOption //15380305-Geo
            {
                SkuName = "Premium",
                NonSSL = true,
                Cluster = true,
                MinShards = 2,
                Tag = new List<string> { "15380305" , "Geo" }
            },
            new RedisOption //21253924
            {
                SkuName = "Premium",
                NonSSL = true,
                Tag = new List<string> { "21253924" }
            },
            new RedisOption //16021106-Geo
            {
                SkuName = "Premium",
                NonSSL = true,
                Tag = new List<string> { "16021106" ,"Geo" }
            },
            new RedisOption //16021140-Geo
            {
                SkuName = "Premium",
                NonSSL = true,
                Tag = new List<string> { "16021140" , "Geo" }
            },
            new RedisOption //16021226-Geo
            {
                SkuName = "Premium",
                NonSSL = true,
                Tag = new List<string> { "16021226", "Geo" }
            },
            new RedisOption //29643710-Geo
            {
                SkuName = "Premium",
                NonSSL = true,
                Tag = new List<string> { "29643710" , "Geo" }
            }            
        };
        public static readonly EnterpriseCacheOptions[] EntOpt = new EnterpriseCacheOptions[]
        {
            new EnterpriseCacheOptions //15318672-Enterprise
            {
                SkuName = RedisEnterpriseSkuName.EnterpriseE10,
                Tag = new List<string> { "153186722" }
            },
            new EnterpriseCacheOptions //15318659
            {
                SkuName = RedisEnterpriseSkuName.EnterpriseE10,
                Tag = new List<string> { "153186592" }
            },
            new EnterpriseCacheOptions //24879297
            {
                SkuName = RedisEnterpriseSkuName.EnterpriseE10,
                Tag = new List<string> { "248792972" }
            }
        };
    }
}
