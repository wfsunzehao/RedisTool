using Microsoft.AspNetCore.SignalR;
using redis.WebAPI.Service;
using System;
using System.Threading.Tasks;

namespace redis.WebAPI.Controllers.Create
{
    public class CreateHub : Hub
    {
        private readonly TimerService _timerService;

        // Constructor injection of TimerService
        public CreateHub(TimerService timerService)
        {
            _timerService = timerService;
        }

        // Automatically start the timer when the client connects
        public override async Task OnConnectedAsync()
        {
            Console.WriteLine("Client connected.");

            // Start the timer by default if it's not running
            //if (!_timerService.IsTimerRunning)
            //{
            //    _timerService.StartTimer(TimerCallbackMethod);
            //}

            await Clients.Caller.SendAsync("TimerStarted", "Timer started automatically upon connection.");
        }

        // Stop the timer when the client disconnects
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine("Client disconnected.");

            // Stop the timer if there are no other connections
            if (_timerService.IsTimerRunning)
            {
                _timerService.StopTimer();
            }

            await base.OnDisconnectedAsync(exception);
        }

        // Timer callback method that executes periodic tasks
        private void TimerCallbackMethod(object state)
        {
            // Generate a random object and send it to all connected clients
            var randomObject = _timerService.GenerateRandomObject();

            try
            {
                // Send the random object to all clients
                Clients.All.SendAsync("ReceiveRandomObject", randomObject);
                Console.WriteLine("Sent random object to clients.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error sending data to clients: " + ex.Message);
            }
        }

        // Function to manually start the timer
        public async Task StartTimerManually()
        {
            if (!_timerService.IsTimerRunning)
            {
                _timerService.StartTimer(TimerCallbackMethod);
                await Clients.Caller.SendAsync("TimerStarted", "Timer started manually.");
            }
        }

        // Function to manually stop the timer
        public async Task StopTimerManually()
        {
            if (_timerService.IsTimerRunning)
            {
                _timerService.StopTimer();
                await Clients.Caller.SendAsync("TimerStopped", "Timer stopped manually.");
            }
        }
    }
}
