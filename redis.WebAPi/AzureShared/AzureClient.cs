using Azure.Core;
using Azure.Core.Pipeline;
using Azure.Identity;
using Azure.ResourceManager;
using Azure.ResourceManager.KeyVault;
using Azure.ResourceManager.ManagedServiceIdentities;
using Azure.ResourceManager.Redis;
using Azure.ResourceManager.Resources;
using System.Security.Cryptography.X509Certificates;

namespace Shared
{
    /// <summary>
    /// Client to communicate with Azure
    /// </summary>
    public class AzureClient
    {
        public ArmClient ArmClient { get; set; }

        public TokenCredential TokenCredential { get; private set; }

        public ResourceGroupResource ResourceGroupResource { get; set; }

        public string ResourceGroupName { get; set; }
        public AzureLocation Location { get; set; }

        public SubscriptionResource Subscription { get; set; }

        public ResourceGroupCollection ResourceCollection { get; set; }

        public RedisCollection RedisCollection { get; set; }

        public List<RedisResource> RedisList { get; set; }

        public UserAssignedIdentityCollection UserAssignedIdentitiesCollection { get; set; }
        public KeyVaultCollection KeyVaultCollection { get; set; }

        private AzureClient() { }


        /// <summary>
        /// Returns the ARM client options that should be used.
        /// </summary>
        /// <remarks>
        /// Setting the <c>ArmHostHeader</c> key in functional test settings
        /// will apply the value as the <c>host</c> header in HTTP requests
        /// going to ARM.
        /// </remarks>


        // TODO: move to a mangager class
        public static async Task<AzureClient> InitializeAzureClientAsync(AzureLocation location,
            string? subscriptionId,
            string resourceGroupName,
            string? tenantId = null)
        {
            var client = new AzureClient
            {
                Location = location,
                ResourceGroupName = resourceGroupName
            };

            // For outlook based subscriptions in dogfood/stage, tenantId will be set
            // in FunctionalTestParameters.json. 
            // For Prod and TiP tenantId is specified in EnvironmentConstants 
            if (string.IsNullOrEmpty(tenantId))
            {
                tenantId = "72f988bf-86f1-41af-91ab-2d7cd011db47";
            }

            string? applicationId = null;

            // For Prod, TiP and Stage environments where the tenantId is known, load up known 
            // known applicationId
            applicationId = "d12243c1-a5bb-4217-92ba-c0da3d5c10ab";

            ArmClient? armClient = null;

            TokenCredential? tokenCredential = null;

            // For instances where application id is not loaded, like, executing on local dev box in outlook based tenant
            // for dogfood/stage environments, use powershell context. You can login using powershell 
            // 'Login-AzAccount -Environment Dogfood'
            tokenCredential = new AzurePowerShellCredential();

                // TODO: Find on setting login authhost from visualstudio, when set, we can use defaultcredential instead
                // of powershell context
                //VisualStudioCredential visualStudioCredential = new VisualStudioCredential(new VisualStudioCredentialOptions()
                //{
                //    AuthorityHost = EnvironmentConstants.GetAuthorityHost(cloud),
                //});
            armClient = new ArmClient(tokenCredential, subscriptionId);

            armClient ??= await GetArmClientAuthBasedOnApp(subscriptionId, tenantId, applicationId, armClient);

            client.ArmClient = armClient;
            
            return client;
        }

        /// <summary>
        /// For running tests in stage environment using Cloud test pipelines, we need to use certificate based auth
        /// Cloud Test VM -> Fetch certificate from local store -> Get Access to CloudTestApp
        /// -> Using CloudTestApp, get access to Team Secrets Keyvault -> Fetch certificate from Team Secrets Keyvault
        /// -> Use certificate to get access to stage FunctionalTestsApp (present in different tenant) -> Use stage FunctionalTestsApp
        /// to get access to stage subscription
        /// </summary>
        /// <param name="subscriptionId"></param>
        /// <param name="tenantId"></param>
        /// <param name="applicationId"></param>
        /// <param name="armClient"></param>
        /// <param name="armEnvironment"></param>
        /// <returns></returns>
 

        private static async Task<ArmClient> GetArmClientAuthBasedOnApp(string? subscriptionId, string? tenantId, string? applicationId, ArmClient? armClient)
        {
            Uri authHost = AzureAuthorityHosts.AzurePublicCloud;
            Uri keyVaultUril = new Uri("https://azurecache-sharedsecrets.vault.azure.net/");

            string certificateName = "RedisCacheFunctionalTests";
            X509Certificate2 functionalTestsCertificate = await AuthHelpers.GetCertificateFromKeyVaultAsync(certificateName, keyVaultUril, tenantId!);

            ClientCertificateCredential clientCertificateCredential = new ClientCertificateCredential(tenantId,
                applicationId,
                functionalTestsCertificate,
                new ClientCertificateCredentialOptions()
                {
                    AuthorityHost = authHost,
                    SendCertificateChain = true
                });

            armClient = new ArmClient(clientCertificateCredential, subscriptionId);

            return armClient;
        }

        private static async Task<List<RedisResource>> GetAllRedisResourcesAsync(RedisCollection redisCollection)
        {
            var redisList = new List<RedisResource>();
            var redisResources = redisCollection?.GetAllAsync();
            if (redisResources != null)
            {
                await foreach (var redis in redisResources)
                {
                    redisList.Add(redis);
                }
            }
            return redisList;
        }

        public static async Task<ArmClient> SetClientSub(AzureClient client, ArmClient armClient,string subscriptionId) 
        {
            
            client.Subscription = armClient.GetSubscriptionResource(new ResourceIdentifier("/subscriptions/" + subscriptionId));
            client.ResourceCollection = client.Subscription.GetResourceGroups();

            client.RedisCollection = client.ResourceGroupResource.GetAllRedis();
            client.UserAssignedIdentitiesCollection = client.ResourceGroupResource.GetUserAssignedIdentities();
            client.KeyVaultCollection = client.ResourceGroupResource.GetKeyVaults();

            client.RedisList = await GetAllRedisResourcesAsync(client.RedisCollection);
            return armClient;
        }



    }
}
