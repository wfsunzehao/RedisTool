using Azure.Core;
using Azure;
using redis.WebAPi.Service.AzureShared;
using redis.WebAPi.Service.IService;
using Azure.ResourceManager.Compute;
using Azure.ResourceManager.Compute.Models;

namespace redis.WebAPi.Service
{
    public class ConnectionVMService:IConnectionVMService
    {
        private readonly AzureClientFactory _client;

        public ConnectionVMService(AzureClientFactory client)
        {
            _client = client;
        }

        public async Task<string> ConnectionVM() 
        {
            try
            {
                string fileName = "/home/azureuser/output-1211.json";
                var armClient = _client.ArmClient;
                var subResource = armClient.GetSubscriptionResource(new ResourceIdentifier("/subscriptions/" + "fc2f20f5-602a-4ebd-97e6-4fae3f1f6424"));
                var vm1 = (await subResource.GetResourceGroupAsync("MemtierbenchmarkTest")).Value.GetVirtualMachine("MemtierBenchmarkM3-Premium-P5");

                var runCommandInput = new RunCommandInput("RunShellScript")
                {
                };
                runCommandInput.Script.Add($"python3 /home/azureuser/read_result.py {fileName}");

                var response = (await vm1.Value.RunCommandAsync(WaitUntil.Completed,runCommandInput)).Value;

                var output = string.Join("\n", response.Value.Select(r => r.Message));
                return output;

            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                throw; //Re-throw the exception to be handled in the controller 
            }
        }
    }
}
