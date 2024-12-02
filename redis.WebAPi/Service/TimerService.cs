namespace redis.WebAPI.Service
{
    public class TimerService
    {
        private Timer _timer;
        private bool _isTimerRunning;

        // 属性，用于检查定时器是否正在运行
        public bool IsTimerRunning => _isTimerRunning;

        // 启动定时器
        public void StartTimer(TimerCallback callback)
        {
            if (!_isTimerRunning)
            {
                _timer = new Timer(callback, null, TimeSpan.Zero, TimeSpan.FromSeconds(2));
                _isTimerRunning = true;
                Console.WriteLine("Timer started.");
            }
        }

        // 停止定时器
        public void StopTimer()
        {
            if (_isTimerRunning)
            {
                _timer?.Dispose();
                _isTimerRunning = false;
                Console.WriteLine("Timer stopped.");
            }
        }

        // 生成随机对象
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
