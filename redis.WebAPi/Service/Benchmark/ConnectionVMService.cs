using Azure.Core;
using Azure.ResourceManager.Compute.Models;
using Azure;
using Azure.ResourceManager.Compute;
using redis.WebAPi.Service.IService;
using redis.WebAPi.Service.Benchmark;


namespace redis.WebAPi.Service.AzureShared
{
    public class ConnectionVMService : IConnectionVMService
    {
        private readonly AzureClientFactory _client;
        private readonly BenchmarkService _benchmarkService;
        private readonly InsertBenchmarkService _insertBenchmarkService;
        private const string MaxRunningTestsFile = "./running_benchmark_tests_count.txt";
        private const int MaxRunningTests = 2;  // Maximum number of concurrent requests
        public ConnectionVMService(AzureClientFactory client, BenchmarkService benchmarkService, InsertBenchmarkService insertBenchmarkService)
        {
            _client = client;
            _benchmarkService = benchmarkService;
            _insertBenchmarkService = insertBenchmarkService;
        }

        public async Task<string> ConnectionVM(string name, string primary, int clients, int threads, int size, int requests, int pipeline, int times, string TimeStamp)
        {
            try
            {
                var armClient = _client.ArmClient;
                var subResource = armClient.GetSubscriptionResource(new ResourceIdentifier("/subscriptions/" + "fc2f20f5-602a-4ebd-97e6-4fae3f1f6424"));
                var vm1 = (await subResource.GetResourceGroupAsync("MemtierbenchmarkTest")).Value.GetVirtualMachine("MemtierBenchmarkM3-Premium-P5");
                string timeStamp = TimeStamp;
                string fileName = $"output-{timeStamp}";

                // Get an instance view of the virtual machine to check its status
                var instanceView = await vm1.Value.InstanceViewAsync();
                var statuses = instanceView.Value.Statuses;

                // Check whether the VM is running
                bool isRunning = statuses.Any(status => status.Code == "PowerState/running");

                if (!isRunning)
                {
                    await vm1.Value.PowerOnAsync(WaitUntil.Completed);
                    Console.WriteLine("The VM is being started");
                }
                else
                {
                    Console.WriteLine("The VM is already running");
                }
                // 2. Check that the number of concurrent requests does not exceed the maximum
                int runningTests = GetRunningTestsCount();

                while (runningTests <= 0)
                {
                    await Task.Delay(50000); // Check the number of concurrent files every 50 seconds
                    runningTests = GetRunningTestsCount();
                }
                // 3. Start a new benchmark
                UpdateRunningTestsCount(runningTests - 1); // Update the number of concurrent requests in the file to reduce by 1
                await _benchmarkService.UpdateBenchmarkStatus(name, 3);
                
                //todo:ÅÐ¶ÏSSLºÍNo-SSL
                var runCommandInput = new RunCommandInput("RunShellScript")
                {
                    Script = {
                        "cd /home/azureuser",
                        $"./manage_screen_session.sh {name} {primary} {threads} {clients} {requests} {pipeline} {size} {times} {fileName}",
                    }
                };

                var response = (await vm1.Value.RunCommandAsync(WaitUntil.Completed, runCommandInput)).Value;

                var output = string.Join("\n", response.Value.Select(r => r.Message));
                // 3. Increase the number of concurrent updates by 1 after the execution is complete
                UpdateRunningTestsCount(runningTests); 
                                                      
                await _insertBenchmarkService.InsertBenchmarkData(output, name, timeStamp);
                await _benchmarkService.UpdateBenchmarkStatus(name, 1);
                return output;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                throw;
            }
        }
        // Gets the number of benchmarks currently running
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
                return MaxRunningTests; 
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading running tests file: {ex.Message}");
                return MaxRunningTests;
            }
        }
        // Update the number of benchmarks (concurrency in the file)
        private void UpdateRunningTestsCount(int newCount)
        {
            try
            {
                File.WriteAllText(MaxRunningTestsFile, newCount.ToString());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error writing running tests file: {ex.Message}");
            }
        }


    }
}

