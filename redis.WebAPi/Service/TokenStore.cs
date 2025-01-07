using System;
using System.Collections.Concurrent;

namespace redis.WebAPi.Service
{
    public static class TokenStore
    {
        private static readonly ConcurrentDictionary<string, (int userId, DateTime expiration)> _tokens = new();


        public static void AddToken(string token, int userId)
        {
            var expiration = DateTime.UtcNow.AddHours(5); // set 1 hour expired
            _tokens[token] = (userId, expiration);
        }


        public static bool IsValidToken(string token)
        {
            if (_tokens.TryGetValue(token, out var tokenData))
            {

                if (DateTime.UtcNow > tokenData.expiration)
                {
                    _tokens.TryRemove(token, out _);
                    return false;
                }

                return true;
            }

            return false;
        }

        public static int? GetUserId(string token)
        {
            if (_tokens.TryGetValue(token, out var tokenData) && DateTime.UtcNow <= tokenData.expiration)
            {
                return tokenData.userId;
            }

            return null;
        }

        public static void RemoveToken(string token)
        {
            _tokens.TryRemove(token, out _);
        }

        public static void CleanupExpiredTokens()
        {
            foreach (var token in _tokens.Keys)
            {
                if (_tokens.TryGetValue(token, out var tokenData) && DateTime.UtcNow > tokenData.expiration)
                {
                    _tokens.TryRemove(token, out _);
                }
            }
        }
    }
}