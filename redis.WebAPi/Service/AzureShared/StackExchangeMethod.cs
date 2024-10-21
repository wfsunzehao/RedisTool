using Azure.ResourceManager.Redis;
using StackExchange.Redis;


namespace redis.WebAPi.Service.AzureShared
{
    public static class StackExchangeExtensionMethods
    { 
        private static async Task<ConnectionMultiplexer> GetConnectionMultiplexerAsync(RedisResource RedisCache, string port = "6379",
            bool ssl = false,
            int syncTimeoutSeconds = 10)
        {
            //Correct ssl configuration according to incoming port value
            ssl = (port == "6380");

            var keys = await RedisCache.GetKeysAsync();
            var password = keys.Value.PrimaryKey;
            ConfigurationOptions options = new ConfigurationOptions();
            options.EndPoints.Add($"{RedisCache.Data.HostName}:" + port);
            options.Password = password;
            options.Ssl = ssl;
            options.AbortOnConnectFail = false;
            options.AllowAdmin = true;
            options.SyncTimeout = syncTimeoutSeconds * 1000;
            options.ConnectRetry = 3;
            options.ConnectTimeout = Math.Max(syncTimeoutSeconds, 15 * 1000);
            options.SslProtocols = System.Security.Authentication.SslProtocols.Tls12;

            return ConnectionMultiplexer.Connect(options);
        }

        public static async Task<long> AddDataBulk(this RedisResource RedisCache, string port, bool ssl, long numKeysPerShard, int valueSize = 1024, long ttlSeconds = 0)
        {
            ConnectionMultiplexer mx = await GetConnectionMultiplexerAsync(RedisCache, port, ssl, syncTimeoutSeconds: 120);
            IDatabase db = mx.GetDatabase(0);

            // total number of keys set, which is returned at the end of this method
            long totalKeys = 0;

            // generate a random value to use for all keys
            var rand = new Random();
            byte[] value = new byte[valueSize];
            rand.NextBytes(value);

            // in order to quickly populate a cache with data, we execute a small number of Lua scripts on each shard
            var clusterConfig = mx.GetServer(mx.GetEndPoints().First()).ClusterConfiguration;

            // non clustered case
            if (clusterConfig == null)
            {
                AddDataWithLuaScript(mx, numKeysPerShard, value, "", ttlSeconds);
                return numKeysPerShard;
            }

            // clustered case
            foreach (var node in clusterConfig.Nodes.Where(n => !n.IsReplica))
            {
                // numSlots is the number of slots over which to distribute a shard's keys
                int numSlots = Math.Min(100, node.Slots.Sum((range) => range.To - range.From));
                var slots = new List<int>();
                for (int i = 0; i < numSlots; i++)
                {
                    // compute a value that hashes to this node and use it as a hash tag
                    var hashTagAndSlot = GetHashTagForNode(mx, node.Slots, slots, rand);

                    long numKeys = (numKeysPerShard / numSlots) + 1; // +1 so numKeys > 0 when numKeysPerShard < numSlots
                    AddDataWithLuaScript(mx, numKeys, value, hashTagAndSlot.Item1, ttlSeconds);
                    totalKeys += numKeys;
                    slots.Add(hashTagAndSlot.Item2);
                }
            }

            mx.Close();
            return totalKeys;
        }

        private static Tuple<string, int> GetHashTagForNode(ConnectionMultiplexer mx,
            IList<SlotRange> slotRanges,
            IList<int> excludedSlots,
            Random rand)
        {
            string hashTag = null;
            while (true)
            {
                hashTag = "-{" + rand.Next() + "}-";
                int slot = mx.HashSlot(hashTag);
                if ((excludedSlots == null || !excludedSlots.Contains(slot)) &&
                    (slotRanges.Any((range) => range.From <= slot && slot <= range.To)))
                {
                    return new Tuple<string, int>(hashTag, slot);
                }
            }
        }

        private static void AddDataWithLuaScript(ConnectionMultiplexer mx, long numKeys, byte[] value, string hashTag, long ttlSeconds = 0, long batchSize = 7_500)
        {
            string script = @"
                        local i = tonumber(@initIndex)
                        while i < tonumber(@numKeys) do
                            if (@ttlSeconds == '0') then
                                redis.call('set', 'mykey'..@hashTag..i, @value)
                            else
                                redis.call('set', 'mykey'..@hashTag..i, @value, 'ex', @ttlSeconds)
                            end
                            i = i + 1
                        end
                    ";

            var prepared = LuaScript.Prepare(script);

            // An attempt to batch these inserts so they're less likely to timeout
            long keysPerInsert = batchSize;
            long i = 0;
            while (keysPerInsert * i < numKeys)
            {
                long insertToValue = Math.Min(numKeys, keysPerInsert * (i + 1)); // On the final iteration we don't want to go to the full multiple of $batchSize
                long startingIndex = keysPerInsert * i;
                mx.GetDatabase(0).ScriptEvaluate(prepared, new
                {
                    initIndex = startingIndex,
                    numKeys = insertToValue,
                    value = value,
                    hashTag = (RedisKey)hashTag,
                    ttlSeconds = ttlSeconds,
                });
                i += 1;
            }
        }

        private static string GenerateRandomString(int length)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyz";
            var random = new Random();
            var result = new string(
                Enumerable.Repeat(chars, length)
                          .Select(s => s[random.Next(s.Length)])
                          .ToArray());
            return result;
        }

        public static async Task<long> GetKeyCountAsync(this RedisResource RedisCache,
            string port,bool ssl, bool isGeoSecondaryCache = false, int numOfRetries = 1)
        {
            ConnectionMultiplexer mx = await GetConnectionMultiplexerAsync(RedisCache, port, ssl);
            var clusterConfig = mx.GetServer(mx.GetEndPoints().First()).ClusterConfiguration;

            long numOfKeys = 0;
            for (int i = 0; i < numOfRetries; i++)
            {
                try
                {
                    if (clusterConfig == null)
                    {
                        return mx.GetServer(mx.GetEndPoints().First()).DatabaseSize(0);
                    }
                    if (isGeoSecondaryCache)
                    {
                        // For geo-secondary caches, all the node's (both primary and replica) redis-server
                        // roles are 'replica' only, hence we won't be able to fetch the node's primary or
                        // replica info using redis-server's role. Hence, using cluster node's isreplica function
                        // to fetch primary nodes of geo-secondary cache to get the total number of keys in the cache.
                        numOfKeys = clusterConfig
                           .Nodes
                           .Where(n => !n.IsReplica)
                           .Select(n => n.EndPoint)
                           .Select(e => mx.GetServer(e))
                           .Sum(s => s.DatabaseSize(0));
                    }
                    else
                    {
                        // For non geo-secondary caches, we can use the redis-server role of nodes to get all the primary
                        // nodes of the cache to get key count. Cluster node's isreplica found to be not returning the real-time
                        // primary/replica info of the nodes when they are under reboot operation, hence server's isreplica function
                        // is used to get key count.
                        numOfKeys = clusterConfig
                           .Nodes
                           .Select(n => n.EndPoint)
                           .Select(e => mx.GetServer(e))
                           .Where(s => !s.IsReplica && s.IsConnected)
                           .Sum(s => s.DatabaseSize(0));
                    }
                    return numOfKeys;
                }
                catch (RedisTimeoutException ex)
                {
                    Console.WriteLine($"Caught RedisTimeoutException while counting total number of keys at time in UTC: {DateTimeOffset.UtcNow} during retry: {i + 1} is {ex}");
                    if (i + 1 == numOfRetries)
                    {
                        throw;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Caught Exception while counting total number of keys at time in UTC: {DateTimeOffset.UtcNow} during retry: {i + 1} is: {ex}");
                    throw;
                }
                await Task.Delay(120000);
            }
            return numOfKeys;
        }

        

       

        public static async Task<string> GetValueByKey(RedisResource cache, string port, bool ssl, string key)
        {
            ConnectionMultiplexer mx = await GetConnectionMultiplexerAsync(cache, port, ssl);
            IDatabase db = mx.GetDatabase();
            return db.StringGet(key);
        }
    }
}
