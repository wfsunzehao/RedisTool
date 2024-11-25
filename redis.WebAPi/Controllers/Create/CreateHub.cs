using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace redis.WebAPI.Controllers.Create
{
    public class CreateHub : Hub
    {
        private readonly Timer _timer;
        private readonly Random _random;
        private bool _isDisposed = false;

        public CreateHub()
        {
            _random = new Random();
            // Trigger the GenerateAndSendRandomObject method every 2 seconds
            _timer = new Timer(GenerateAndSendRandomObject, null, TimeSpan.Zero, TimeSpan.FromSeconds(2));
        }

        // Send a random object every 2 seconds
        private async void GenerateAndSendRandomObject(object? state)
        {
            if (_isDisposed) return;  // If the object is disposed, avoid further execution

            var randomObject = GenerateRandomObject();
            // Send to all connected clients
            await Clients.All.SendAsync("ReceiveRandomObject", randomObject); // Make sure the event name "ReceiveRandomObject" matches the frontend
        }

        // Logic to generate a random object
        private object GenerateRandomObject()
        {
            var statusOptions = new[] { "Creating", "Running", "Deleting" };
            var randomStatus = statusOptions[_random.Next(statusOptions.Length)];

            var randomObject = new
            {
                Name = $"Object_{_random.Next(1, 100)}",
                Time = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"),
                Status = randomStatus
            };

            return randomObject;
        }

        // Manually trigger a request to send a random object
        public async Task SendRandomObjectManually()
        {
            var randomObject = GenerateRandomObject();
            // Send to the calling client
            await Clients.Caller.SendAsync("ReceiveRandomObject", randomObject);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
            Dispose(true);  // Dispose resources
        }

        // Dispose resources
        protected override void Dispose(bool disposing)
        {
            if (_isDisposed) return;

            if (disposing)
            {
                _timer?.Dispose();  // Stop the timer
            }

            _isDisposed = true;
            base.Dispose(disposing);
        }
    }
}
