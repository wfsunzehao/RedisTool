using Azure.Core;
using Azure.ResourceManager.Compute.Models;
using Azure;
// using Renci.SshNet;
using System;
using redis.WebAPi.Service.AzureShared;
using Azure.ResourceManager.Compute;
using redis.WebAPi.Service.IService;
using redis.WebAPi.Model.BenchmarkModel;
using redis.WebAPi.Service.Benchmark;


namespace redis.WebAPi.Service.AzureShared
{
    public class ConnectionVMService : IConnectionVMService
    {
        private readonly AzureClientFactory _client;
        private readonly BenchmarkService _benchmarkService;
        private readonly InsertBenchmarkService _insertBenchmarkService;
        private const string MaxRunningTestsFile = "./running_benchmark_tests_count.txt";
        private const int MaxRunningTests = 2;  // 最大并发数
        public ConnectionVMService(AzureClientFactory client, BenchmarkService benchmarkService, InsertBenchmarkService insertBenchmarkService)
        {
            _client = client;
            _benchmarkService = benchmarkService;
            _insertBenchmarkService = insertBenchmarkService;
        }

        //public async Task<string> ConnectionVM(ConnectionVMRequest request)
        public async Task<string> ConnectionVM(string name, string primary, int clients, int threads, int size, int requests, int pipeline, int times)
        {
            try
            {
                var armClient = _client.ArmClient;
                var subResource = armClient.GetSubscriptionResource(new ResourceIdentifier("/subscriptions/" + "fc2f20f5-602a-4ebd-97e6-4fae3f1f6424"));
                var vm1 = (await subResource.GetResourceGroupAsync("MemtierbenchmarkTest")).Value.GetVirtualMachine("MemtierBenchmarkM3-Premium-P5");

                // 获取当前时间戳，格式为：yyyyMMddHHmmss（例如：20241223153045）
                string timeStamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
                // 生成文件名
                string fileName = $"output-{timeStamp}";

                // 获取虚拟机的实例视图以检查其状态
                var instanceView = await vm1.Value.InstanceViewAsync();
                var statuses = instanceView.Value.Statuses;

                // 检查虚拟机是否正在运行
                bool isRunning = statuses.Any(status => status.Code == "PowerState/running");

                if (!isRunning)
                {
                    await vm1.Value.PowerOnAsync(WaitUntil.Completed);
                    Console.WriteLine("虚拟机已启动");
                }
                else
                {
                    Console.WriteLine("虚拟机已经在运行中");
                }
                //检查是否达到最大并发数
                // 2. 检查并发数，确保没有超过最大并发数
                int runningTests = GetRunningTestsCount();

                while (runningTests <= 0)
                {
                    await Task.Delay(50000); // 每50秒检查一次文件中的并发数
                    runningTests = GetRunningTestsCount();
                    // 在等待并发时更新数据库中的状态为 3
                    //await _benchmarkService.UpdateBenchmarkStatus(name, 3);

                }
                // 3. 启动新的基准测试
                Console.WriteLine("可以启动新的基准测试");

                // 更新文件中的并发数，减少1
                UpdateRunningTestsCount(runningTests - 1);
                await _benchmarkService.UpdateBenchmarkStatus(name, 3);
                var runCommandInput = new RunCommandInput("RunShellScript")
                {
                    Script = {
                        "cd /home/azureuser",
                        $"./manage_screen_session.sh {name} {primary} {threads} {clients} {requests} {pipeline} {size} {times} {fileName}",
                    }
                };

                var response = (await vm1.Value.RunCommandAsync(WaitUntil.Completed, runCommandInput)).Value;

                var output = string.Join("\n", response.Value.Select(r => r.Message));
                // 3. 执行完毕后更新并发数，增加1
                UpdateRunningTestsCount(runningTests);  // 增加1
                                                      
                await _insertBenchmarkService.InsertBenchmarkData(output, name, timeStamp);
                return output;

            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                throw;
            }
        }
        // 获取当前运行的基准测试数量
        private int GetRunningTestsCount()
        {
            try
            {
                if (File.Exists(MaxRunningTestsFile))
                {
                    var content = File.ReadAllText(MaxRunningTestsFile);
                    if (int.TryParse(content, out int runningTests))
                    {
                        return runningTests;
                    }
                }
                return MaxRunningTests; // 默认最大并发数为 MaxRunningTests
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading running tests file: {ex.Message}");
                return MaxRunningTests;
            }
        }
        // 更新基准测试数量（文件中的并发数）
        private void UpdateRunningTestsCount(int newCount)
        {
            try
            {
                // 将新的并发数写入文件
                File.WriteAllText(MaxRunningTestsFile, newCount.ToString());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error writing running tests file: {ex.Message}");
            }
        }


    }
}

