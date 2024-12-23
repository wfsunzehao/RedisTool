using redis.WebAPi.Models;

namespace redis.WebAPi.Service.IService
{
    public interface IMedianService
    {
        List<MedianResult> ProcessFolder(string baseFolderPath, out List<string> resultMessages);
        byte[] GenerateExcelReport(List<MedianResult> results);
    }
}
