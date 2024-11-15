using Azure;
using Azure.ResourceManager;
using Azure.ResourceManager.Resources;
using Azure.ResourceManager.Storage;
using Azure.ResourceManager.Storage.Models;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;

namespace redis.WebAPi.Service
{
    public class StorageClient
    {
        public static async Task<StorageAccountResource> GetOrCreateStorageAccountAsync(ResourceGroupResource resourceGroup,
            string storageAccountName,
            string storageAccountRegion)
        {
            StorageAccountCreateOrUpdateContent parameters = new StorageAccountCreateOrUpdateContent(
                new StorageSku(StorageSkuName.StandardLrs),
                "StorageV2",
                storageAccountRegion);

            StorageAccountCollection accountCollection = resourceGroup.GetStorageAccounts();
            ArmOperation<StorageAccountResource> acctOperation = await accountCollection.CreateOrUpdateAsync(WaitUntil.Completed,
                storageAccountName,
                parameters);

            StorageAccountResource storageAccount = acctOperation.Value;

            return storageAccount;
        }

        public static async Task<IEnumerable<string>> ListBlobsAsync(string containerName,
            string prefix,
            StorageAccountResource storageAccountResource)
        {
            IList<string> blobItemNames = new List<string>();

            BlobContainerClient blobContainerClient = EnsureBlobContainerClient(storageAccountResource, containerName);

            var blobItems = blobContainerClient.GetBlobsAsync(prefix: prefix)
            .AsPages(default);

            await foreach (Page<BlobItem> blobPage in blobItems)
            {
                foreach (BlobItem blobItem in blobPage.Values)
                {
                    blobItemNames.Add(blobItem.Name);
                }
            }

            return blobItemNames;
        }

        public static async Task<string> GetConnectionStringAsync(StorageAccountResource account)
        {
            var primaryKey = account.GetKeys().First().Value;

            return $"DefaultEndpointsProtocol=https;AccountName={account.Data.Name};AccountKey={primaryKey};EndpointSuffix=core.windows.net";
        }

        private static async Task ListBlobsHelperAsync(BlobContainerClient blobContainerClient,
            string prefix,
            IList<string> blobItemNames)
        {
            var blobItems = blobContainerClient
                .GetBlobsByHierarchyAsync(prefix: prefix, delimiter: "/")
                .AsPages(default);

            await foreach (Page<BlobHierarchyItem> blobPage in blobItems)
            {
                foreach (BlobHierarchyItem blobhierarchyItem in blobPage.Values)
                {
                    if (blobhierarchyItem.IsPrefix)
                    {
                        await ListBlobsHelperAsync(blobContainerClient, blobhierarchyItem.Prefix, blobItemNames);
                    }
                    if (blobhierarchyItem.IsBlob)
                    {
                        blobItemNames.Add(blobhierarchyItem.Blob.Name);
                    }
                }
            }
        }

        public static async Task<bool> BlobsExistsInsideDirectoryAsync(string containerName,
            string dirName,
            StorageAccountResource storageAccountResource)
        {
            IEnumerable<string> blobs = await ListBlobsAsync(containerName, dirName, storageAccountResource);

            return blobs.Any();
        }

        public static async Task DeleteContainerAsync(string containerName,
            StorageAccountResource storageAccountResource)
        {
            var containerClient = GetBlobContainerClient(storageAccountResource, containerName);

            await containerClient.DeleteIfExistsAsync();
        }

        public static Uri GetContainerSasUriAsync(string containerName,
            StorageAccountResource storageAccountResource)
        {
            BlobContainerClient blobContainerClient = EnsureBlobContainerClient(storageAccountResource, containerName);

            // TODO: check if blobContainerClient.CanGenerateSasUri
            BlobSasBuilder blobSasBuilder = new BlobSasBuilder()
            {
                BlobContainerName = containerName,
                Resource = "c"
            };

            blobSasBuilder.StartsOn = DateTimeOffset.UtcNow.AddMinutes(-30);
            blobSasBuilder.ExpiresOn = DateTimeOffset.UtcNow.AddHours(5);
            blobSasBuilder.SetPermissions(BlobContainerSasPermissions.Read | BlobContainerSasPermissions.Delete | BlobContainerSasPermissions.List | BlobContainerSasPermissions.Write);

            Uri sasUri = blobContainerClient.GenerateSasUri(blobSasBuilder);

            return sasUri;
        }

        public static IEnumerable<Uri> GetSasUrisofBlobsWithCommonPrefix(string containerName, string blobNamePrefix, StorageAccountResource storageAccountResource)
        {
            BlobContainerClient blobContainerClient = EnsureBlobContainerClient(storageAccountResource, containerName);

            var blobItems = blobContainerClient.GetBlobs(prefix: blobNamePrefix);

            List<Uri> sasUris = new List<Uri>();

            foreach (BlobItem blobItem in blobItems)
            {
                BlobClient blobClient = blobContainerClient.GetBlobClient(blobItem.Name);

                BlobSasBuilder blobSasBuilder = new BlobSasBuilder()
                {
                    BlobName = blobItem.Name,
                    Resource = "b"
                };

                blobSasBuilder.StartsOn = DateTimeOffset.UtcNow.AddMinutes(-30);
                blobSasBuilder.ExpiresOn = DateTimeOffset.UtcNow.AddHours(5);
                blobSasBuilder.SetPermissions(BlobSasPermissions.Read | BlobSasPermissions.Delete | BlobSasPermissions.List | BlobSasPermissions.Write);

                Uri sasUri = blobClient.GenerateSasUri(blobSasBuilder);
                sasUris.Add(sasUri);
            }

            return sasUris;
        }

        public static BlobContainerClient EnsureBlobContainerClient(StorageAccountResource storageAccountResource,
            string containerName)
        {
            BlobContainerClient blobContainerClient = GetBlobContainerClient(storageAccountResource, containerName);

            blobContainerClient.CreateIfNotExists();

            return blobContainerClient;
        }

        private static BlobContainerClient GetBlobContainerClient(StorageAccountResource storageAccountResource,
            string containerName)
        {
            string accountName = storageAccountResource.Data.Name;

            Pageable<StorageAccountKey> storageAccountKeys = storageAccountResource.GetKeys();

            var accountKey = storageAccountKeys.First().Value;

            StorageSharedKeyCredential credential = new StorageSharedKeyCredential(accountName,
                accountKey);

            Uri accountUri = new Uri($"https://{accountName}.blob.core.windows.net/{containerName}");
            BlobContainerClient blobContainerClient = new BlobContainerClient(accountUri, credential);

            return blobContainerClient;
        }
    }
}
