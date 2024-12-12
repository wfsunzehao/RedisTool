using System;
using System.Text;
using Konscious.Security.Cryptography;

namespace redis.WebAPi.Service
{
    public class PasswordHasher
    {
        public static (string hash, string salt) HashPassword(string password)
        {
            // generate salt
            var saltBytes = new byte[16];
            using (var rng = new System.Security.Cryptography.RNGCryptoServiceProvider())
            {
                rng.GetBytes(saltBytes);
            }
            var salt = Convert.ToBase64String(saltBytes);

            // Argon2
            var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
            {
                Salt = saltBytes,
                DegreeOfParallelism = 8, 
                MemorySize = 65536,      
                Iterations = 4           
            };

            var hashBytes = argon2.GetBytes(32);
            var hash = Convert.ToBase64String(hashBytes);

            return (hash, salt);
        }

        public static bool VerifyPassword(string password, string hash, string salt)
        {
            var saltBytes = Convert.FromBase64String(salt);
            var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
            {
                Salt = saltBytes,
                DegreeOfParallelism = 8,
                MemorySize = 65536,
                Iterations = 4
            };

            var hashBytes = argon2.GetBytes(32);
            return Convert.ToBase64String(hashBytes) == hash;
        }
    }
}
