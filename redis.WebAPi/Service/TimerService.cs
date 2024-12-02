namespace redis.WebAPI.Service
{
    public class TimerService
    {
        private Timer _timer;
        private bool _isTimerRunning;

        // Property to check if the timer is currently running
        public bool IsTimerRunning => _isTimerRunning;

        // Start the timer
        public void StartTimer(TimerCallback callback)
        {
            if (!_isTimerRunning)
            {
                _timer = new Timer(callback, null, TimeSpan.Zero, TimeSpan.FromSeconds(2));
                _isTimerRunning = true;
                Console.WriteLine("Timer started.");
            }
        }

        // Stop the timer
        public void StopTimer()
        {
            if (_isTimerRunning)
            {
                _timer?.Dispose();
                _isTimerRunning = false;
                Console.WriteLine("Timer stopped.");
            }
        }

        // Generate a random object
        public object GenerateRandomObject()
        {
            var random = new Random();
            var statusOptions = new[] { "Creating", "Running", "Deleting" };
            var randomStatus = statusOptions[random.Next(statusOptions.Length)];

            var randomObject = new
            {
                Name = $"Object_{random.Next(1, 100)}",
                Time = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"),
                Status = randomStatus
            };

            return randomObject;
        }
    }
}
