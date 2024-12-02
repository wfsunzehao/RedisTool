using Microsoft.AspNetCore.SignalR;
using redis.WebAPI.Service;
using System;
using System.Threading.Tasks;

namespace redis.WebAPI.Controllers.Create
{
    public class CreateHub : Hub
    {
        private readonly TimerService _timerService;

        // 构造函数注入 TimerService
        public CreateHub(TimerService timerService)
        {
            _timerService = timerService;
        }

        // 客户端连接时，自动启动定时器
        public override async Task OnConnectedAsync()
        {
            Console.WriteLine("Client connected.");

            // 默认启动定时器
            if (!_timerService.IsTimerRunning)
            {
                _timerService.StartTimer(TimerCallbackMethod);
            }

            await Clients.Caller.SendAsync("TimerStarted", "Timer started automatically upon connection.");
        }

        // 客户端断开连接时，停止定时器
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine("Client disconnected.");

            // 如果没有其他连接，则停止定时器
            if (_timerService.IsTimerRunning)
            {
                _timerService.StopTimer();
            }

            await base.OnDisconnectedAsync(exception);
        }

        // 定时器回调方法，执行定时任务
        private void TimerCallbackMethod(object state)
        {
            // 生成随机对象并发送给所有连接的客户端
            var randomObject = _timerService.GenerateRandomObject();

            try
            {
                // 发送随机对象给所有客户端
                Clients.All.SendAsync("ReceiveRandomObject", randomObject);
                Console.WriteLine("Sent random object to clients.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error sending data to clients: " + ex.Message);
            }
        }

        // 手动启动定时器的功能
        public async Task StartTimerManually()
        {
            if (!_timerService.IsTimerRunning)
            {
                _timerService.StartTimer(TimerCallbackMethod);
                await Clients.Caller.SendAsync("TimerStarted", "Timer started manually.");
            }
        }

        // 手动停止定时器的功能
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
