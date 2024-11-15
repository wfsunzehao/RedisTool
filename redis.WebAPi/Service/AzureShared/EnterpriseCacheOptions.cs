using Azure.ResourceManager.RedisEnterprise;
using Azure.Core;
using Azure.ResourceManager.RedisEnterprise.Models;

namespace redis.WebAPi.Service.AzureShared
{
    public class EnterpriseCacheOptions
    {
        // TODO: add more options here
        public enum Module
        {
            RedisBloom,
            RediSearch,
            RedisTimeSeries,
            RedisJSON
        }

        public enum PersistenceType
        {
            OFF,
            RDB,
            AOF
        }
        public ResourceIdentifier SubnetId { get; set; }

        public string ClusteringPolicy { get; set; } = "OSSCluster";

        public string ClientProtocol { get; set; } = "Encrypted";

        public RedisEnterpriseSkuName SkuName { get; set; }

        public string RegionName { get; set; }

        public int Capacity { get; set; }

        public Module[]? Modules { get; set; }

        public string[] Zones { get; set; }

        public PersistenceType Persistence { get; set; }

        public string CachePrefix { get; set; }

        public RedisEnterpriseEvictionPolicy? EvictionPolicy { get; set; }

        public IList<string> Tag { get; set; }


        /// <summary>
        /// CRDB cache databases are the ones which can be used for Active-Active georeplication.
        /// Note: actually its a database level setting, not a cluster level setting, but I'm not sure our tests distinguish that today.
        /// </summary>
        public bool CRDB { get; set; }

        public string LinkedDatabaseName { get; set; }

        public bool Matches(RedisEnterpriseClusterResource cache, AzureLocation defaultRegion)
        {
            if (!cache.Data.Sku.Name.Equals(SkuName))
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Determines if the selected options are supported by the specified region.
        /// 
        /// This is a best effort implementation that will need to be updated over time.
        /// 
        /// If returns false, unsupportedReason will contain a string explaining which feature is not supported.
        /// </summary>
        /// <returns></returns>
        public bool IsSupportedByRegion(out string unsupportedReason)
        {

            if (RegionName.Equals("eastus2euap", StringComparison.InvariantCultureIgnoreCase))
            {
                unsupportedReason = "East US 2 EUAP does not support Enterprise skus";
                return false;
            }

            if (RegionName.Equals("centraluseuap", StringComparison.InvariantCultureIgnoreCase))
            {
                if (Zones?.Length > 0)
                {
                    unsupportedReason = "Central US EUAP does not support zones";
                    return false;
                }

                var flashSkus = new RedisEnterpriseSkuName[] { RedisEnterpriseSkuName.EnterpriseFlashF300, RedisEnterpriseSkuName.EnterpriseFlashF700, RedisEnterpriseSkuName.EnterpriseFlashF1500 };
                if (flashSkus.Contains(SkuName))
                {
                    unsupportedReason = "Central US EUAP does not support Enterprise Flash skus";
                    return false;
                }
            }

            unsupportedReason = null;
            return true;
        }

        public void UpdateEnterpriseClusterOptions(string skuName, EnterpriseCreateOption[] options, bool isCRDB = false)
        {

            if (options != null && options.Contains(EnterpriseCreateOption.Modules))
            {
                if (skuName.ToLower().Contains("enterpriseflash"))
                {
                    if (options.Contains(EnterpriseCreateOption.Enterprise_Clustering))
                    {
                        this.Modules = new EnterpriseCacheOptions.Module[]
                        {
                            EnterpriseCacheOptions.Module.RediSearch,
                            EnterpriseCacheOptions.Module.RedisJSON
                        };

                        //We can not use eviction policy when we use redissearch module.
                        this.EvictionPolicy = RedisEnterpriseEvictionPolicy.NoEviction;
                    }
                    else
                    {
                       this.Modules = new EnterpriseCacheOptions.Module[]
                       {
                           EnterpriseCacheOptions.Module.RedisJSON
                       };
                    }
                }
                else if (isCRDB)
                {
                    // CRDB support only RedisSearch and RedisJson Modules today
                    if (options.Contains(EnterpriseCreateOption.Enterprise_Clustering))
                    {
                        this.Modules = new EnterpriseCacheOptions.Module[]
                        {
                            EnterpriseCacheOptions.Module.RediSearch,
                            EnterpriseCacheOptions.Module.RedisJSON
                        };
                        //We can not use eviction policy when we use redissearch module.
                        this.EvictionPolicy = RedisEnterpriseEvictionPolicy.NoEviction;

                    }
                    else
                    {
                        this.Modules = new EnterpriseCacheOptions.Module[]
                        {
                            EnterpriseCacheOptions.Module.RedisJSON
                        };
                    }
                }
                else
                {
                    if (options.Contains(EnterpriseCreateOption.Enterprise_Clustering))
                    {
                        this.Modules = new EnterpriseCacheOptions.Module[]
                        {
                            EnterpriseCacheOptions.Module.RedisBloom,
                            EnterpriseCacheOptions.Module.RediSearch,
                            EnterpriseCacheOptions.Module.RedisTimeSeries,
                            EnterpriseCacheOptions.Module.RedisJSON
                        };
                        //We can not use eviction policy when we use redissearch module.
                        this.EvictionPolicy = RedisEnterpriseEvictionPolicy.NoEviction;

                    }
                    else
                    {
                        this.Modules = new EnterpriseCacheOptions.Module[]
                        {
                            EnterpriseCacheOptions.Module.RedisBloom,
                            EnterpriseCacheOptions.Module.RedisTimeSeries,
                            EnterpriseCacheOptions.Module.RedisJSON
                        };
                    }
                }
            }

            if ((options != null && options.Contains(EnterpriseCreateOption.Zones)))
            {
                this.Zones = new string[]
                {
                    "1",
                    "2",
                    "3"
                };
            }

            if (options != null && options.Contains(EnterpriseCreateOption.Persistence_RDB))
            {
                this.Persistence = EnterpriseCacheOptions.PersistenceType.RDB;
            }
            else if (options != null && options.Contains(EnterpriseCreateOption.Persistence_AOF))
            {
                this.Persistence = EnterpriseCacheOptions.PersistenceType.AOF;
            }

            if (options != null && options.Contains(EnterpriseCreateOption.Enterprise_Clustering))
            {
                this.ClusteringPolicy = "EnterpriseCluster";
            }

            return;
        }

        public string GetShortCacheName(string testType, string skuName, int capacity)
        {
            return $"FTC-{testType}-{skuName.Split('_')[1]}-C{capacity}-" + Guid.NewGuid().ToString().Split("-")[0].Substring(0, 4);
        }
    }
}
