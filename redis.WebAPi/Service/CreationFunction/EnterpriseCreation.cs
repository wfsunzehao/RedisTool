using Azure.ResourceManager.RedisEnterprise;
using Azure;
using Azure.Core;
using Azure.ResourceManager.RedisEnterprise.Models;
using redis.WebAPi.Model;
using redis.WebAPi.Service.AzureShared;

namespace redis.WebAPi.Service.CreationFunction
{
    public class EnterpriseCreation
    {

        public static async Task<RedisEnterpriseClusterResource> CreateRedisEnterpriseCacheAsync(P0P1RequestModel redisReques, EnterpriseCacheOptions options,
           string resourceName,
           RedisEnterpriseClusterCollection RedisEC)
        {
            // Approximately. I know 63 is too long because with redis enterprise caches max
            // length is actually limited by an additional suffix of {.regionname}, which can
            // be quite long e.g. (hypothetically, or not) australiasoutheast, dodsouthcentralus,
            // chinanortheast2, germanywestcentral, southafricanortheast
            int MAX_SAFE_NAME_LENGTH = 42;
            var cacheName = resourceName;

            var clusterParams = GenerateClusterParams(redisReques, options);
            try
            {
                Console.WriteLine($"Creating cache '{cacheName}'...");
                var createdCache = (await RedisEC.CreateOrUpdateAsync(WaitUntil.Completed, cacheName, clusterParams)).Value;
                Console.WriteLine($"Created cache '{cacheName}'");
                //var createdCache = await managementClient.RedisEnterprise.CreateAsync(ResourceGroupName, cacheName, clusterParams);

                string dbResourceId = $"/subscriptions/{createdCache.Data.Id.SubscriptionId}/resourceGroups/{createdCache.Data.Id.ResourceGroupName}/providers/Microsoft.Cache/redisEnterprise/{createdCache.Data.Id.Name}/databases/default";
                var databaseParams = GenerateDatabaseParams(options, dbResourceId);
                //var databaseCreate = await managementClient.Databases.CreateAsync(ResourceGroupName, cacheName, "default", databaseParams);
                Console.WriteLine("Creating database...");
                var databaseCreate = await createdCache.GetRedisEnterpriseDatabases().CreateOrUpdateAsync(WaitUntil.Completed, "default", databaseParams);
                Console.WriteLine("Created database");
                return createdCache;
            }
            catch (Exception e)
            {
                string msg = $"Failed to create cache '{cacheName}' due to '{e.GetType().Name}', deleting it to reclaim quota";
                if (e is RequestFailedException rfe)
                {
                    msg += $": ErrorCode = '{rfe.ErrorCode}', Content = '{rfe.GetRawResponse()?.Content.ToString()}'";
                }

                Console.WriteLine(msg);
                await DeleteRedisEnterpriseCacheAsync(cacheName, RedisEC);
                throw;
            }
        }
        private static RedisEnterpriseClusterData GenerateClusterParams(P0P1RequestModel redisReques, EnterpriseCacheOptions options)
        {
            var location = new AzureLocation(!string.IsNullOrWhiteSpace(options.RegionName) ? options.RegionName : redisReques.region);

            var clusterParams = new RedisEnterpriseClusterData(options.RegionName != null ? options.RegionName
                : redisReques.region, new RedisEnterpriseSku(options.SkuName));

            if (options?.Zones?.Length > 0)
            {
                foreach (var s in options.Zones)
                {
                    clusterParams.Zones.Add(s);
                }

            }
            return clusterParams;

        }
        private static RedisEnterpriseDatabaseData GenerateDatabaseParams(EnterpriseCacheOptions options, string dbResourceId)
        {
            var databaseParams = new RedisEnterpriseDatabaseData();
            //var databaseParams = new RedisEnterpriseDatabaseResource();

            if (options?.Modules?.Length > 0)
            {
                var modules = new List<RedisEnterpriseModule>();
                foreach (var module in options.Modules)
                {
                    databaseParams.Modules.Add(new RedisEnterpriseModule("foo")
                    {
                        Name = module.ToString(),
                    });
                }

            }
            if (options?.Persistence == EnterpriseCacheOptions.PersistenceType.RDB)
            {
                databaseParams.Persistence = new RedisPersistenceSettings()
                {
                    IsRdbEnabled = true,
                    RdbFrequency = "1h"
                };
            }
            else if (options?.Persistence == EnterpriseCacheOptions.PersistenceType.AOF)
            {
                databaseParams.Persistence = new RedisPersistenceSettings()
                {
                    IsAofEnabled = true,
                    AofFrequency = "1s"
                };
            }

            if (options?.CRDB ?? false)
            {
                if (options.LinkedDatabaseName == null)
                {
                    databaseParams.GeoReplication = new RedisEnterpriseDatabaseGeoReplication
                    {
                        GroupNickname = "groupfoo",
                        LinkedDatabases =
                        {
                            new RedisEnterpriseLinkedDatabase
                            {
                                Id = new ResourceIdentifier(dbResourceId) // A CRDB cache must be 'linked to itself'
                            }
                        }
                    };
                }
                else
                {
                    string cacheName = new ResourceIdentifier(dbResourceId).Parent.Name;
                    string linkedDbResourceId = dbResourceId.Replace(cacheName, options.LinkedDatabaseName);
                    databaseParams.GeoReplication = new RedisEnterpriseDatabaseGeoReplication
                    {
                        GroupNickname = "groupfoo",
                        LinkedDatabases =
                        {
                            new RedisEnterpriseLinkedDatabase
                            {
                                Id = new ResourceIdentifier(dbResourceId) // A CRDB cache must be 'linked to itself'
                            },
                            new RedisEnterpriseLinkedDatabase
                            {
                                Id = new ResourceIdentifier(linkedDbResourceId)
                            }
                        }
                    };
                }
            }

            if (options?.EvictionPolicy != null)
            {
                databaseParams.EvictionPolicy = options.EvictionPolicy;
            }

            databaseParams.ClusteringPolicy = options.ClusteringPolicy;

            return databaseParams;
        }
        public static async Task DeleteRedisEnterpriseCacheAsync(string clusterName,
            RedisEnterpriseClusterCollection RedisEnterprise
            )
        {
            await RedisEnterprise.Get(clusterName).Value.DeleteAsync(WaitUntil.Completed);
        }
    }
}
