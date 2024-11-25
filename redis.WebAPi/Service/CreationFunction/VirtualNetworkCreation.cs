using Azure.ResourceManager.Network;
using Azure.ResourceManager.Resources;
using Azure;

namespace redis.WebAPi.Service.CreationFunction
{
    public class VirtualNetworkCreation
    {
        public static async Task<VirtualNetworkResource> CreateVirtualNetWorkResourceAsync(string region, ResourceGroupResource resourceGroupResource)
        {
            // Create vnet
            var virtualNetworkCC = resourceGroupResource.GetVirtualNetworks();
            var virtualNetworkParameter = new VirtualNetworkData()
            {
                Location = region,

            };
            virtualNetworkParameter.AddressPrefixes.Add("10.0.2.0/24");
            SubnetData subData = new SubnetData();
            subData.Name = "subnet";
            subData.AddressPrefix = "10.0.2.0/24";

            virtualNetworkParameter.Subnets.Add(subData);

            VirtualNetworkResource virtualNetwork = null;

            virtualNetwork = (await virtualNetworkCC.CreateOrUpdateAsync(WaitUntil.Completed, $"{region.Replace(" ", "").ToLower()}vnet", virtualNetworkParameter)).Value;

            Console.WriteLine($"Successfully created vnet with name '{virtualNetwork.Data.Name}'.");

            return virtualNetwork;
        }
    }
}
