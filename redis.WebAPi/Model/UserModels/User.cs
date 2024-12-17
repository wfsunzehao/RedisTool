using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace redis.WebAPi.Model.UserModels
{
    /// <summary>
    /// Represents a user entity with relevant properties.
    /// </summary>
    public class User
    {
        /// <summary>
        /// Gets or sets the unique identifier for the user.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the username of the user.
        /// </summary>
        [Required(ErrorMessage = "Username is required.")]
        [MaxLength(50, ErrorMessage = "Username cannot exceed 50 characters.")]
        public string Username { get; set; }

        /// <summary>
        /// Gets or sets the email of the user.
        /// </summary>
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the hashed password for the user. This property is hidden in API responses.
        /// </summary>
        [JsonIgnore]
        [Required]
        public string PasswordHash { get; set; }

        /// <summary>
        /// Gets or sets the salt value used in password hashing. This property is hidden in API responses.
        /// </summary>
        [JsonIgnore]
        [Required]
        public string Salt { get; set; }

        /// <summary>
        /// Gets or sets the role of the user. Default value is "user".
        /// </summary>
        public string Role { get; set; } = "user";

        /// <summary>
        /// Gets or sets the creation timestamp of the user.
        /// </summary>
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

        /// <summary>
        /// Gets or sets the last updated timestamp of the user.
        /// </summary>
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}
