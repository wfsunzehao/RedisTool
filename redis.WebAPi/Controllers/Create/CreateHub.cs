using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace redis.WebAPi.Controllers.Create
{
    public class CreateHub : Hub
    {
        // A method called by the client to send a message
        public async Task SendMessage(string user, string message)
        {
            // Broadcast message to all connected clients
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        // A method called by the client to get a random object
        public async Task GetRandomObject()
        {
            var randomObject = GenerateRandomObject();
            // Send the random object to the calling client
            await Clients.Caller.SendAsync("ReceiveRandomObject", randomObject);
        }

        // Method to generate a random object
        private object GenerateRandomObject()
        {
            var random = new Random();
            var randomObject = new
            {
                Id = Guid.NewGuid().ToString(),
                Name = $"Object_{random.Next(1, 100)}",
                Value = random.Next(1, 1000),
                Timestamp = DateTime.UtcNow
            };
            return randomObject;
        }
    }
}
