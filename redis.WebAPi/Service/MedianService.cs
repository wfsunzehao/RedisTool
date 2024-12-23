using OfficeOpenXml;
using redis.WebAPi.Models;
using redis.WebAPi.Service.IService;


namespace redis.WebAPi.Service
{
    public class MedianService : IMedianService
    {
        public List<MedianResult> ProcessFolder(string baseFolderPath, out List<string> resultMessages)
        {
            resultMessages = new List<string>();
            List<MedianResult> allResults = new List<MedianResult>();
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            string[] subDirectories = Directory.GetDirectories(baseFolderPath, "*", SearchOption.TopDirectoryOnly);

            if (subDirectories.Length == 0)
            {
                string[] fileNames = Directory.GetFiles(baseFolderPath, "*.xlsx", SearchOption.TopDirectoryOnly);
                if (fileNames.Any())
                {
                    allResults.AddRange(ProcessFiles(fileNames, new DirectoryInfo(baseFolderPath).Name));
                }
                else
                {
                    resultMessages.Add($"There are no .xlsx files in the current folder {baseFolderPath}");
                }
            }
            else
            {
                foreach (var subDirectory in subDirectories)
                {
                    string[] fileNames = Directory.GetFiles(subDirectory, "*.xlsx", SearchOption.TopDirectoryOnly);
                    if (fileNames.Any())
                    {
                        allResults.AddRange(ProcessFiles(fileNames, new DirectoryInfo(subDirectory).Name));
                    }
                }
            }

            return allResults;
        }

        public byte[] GenerateExcelReport(List<MedianResult> results)
        {
            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Median Report");

                worksheet.Cells[1, 1].Value = "File Name";
                worksheet.Cells[1, 2].Value = "Median";

                int row = 2;
                foreach (var result in results)
                {
                    worksheet.Cells[row, 1].Value = result.FileName;
                    worksheet.Cells[row, 2].Value = result.Median;
                    row++;
                }

                worksheet.Column(1).AutoFit();
                worksheet.Column(2).AutoFit();

                return package.GetAsByteArray();
            }
        }

        private List<MedianResult> ProcessFiles(string[] fileNames, string folderName)
        {
            List<double> medianList = new List<double>();
            List<MedianResult> results = new List<MedianResult>();

            foreach (var fileName in fileNames)
            {
                List<double> data = ExtractData(fileName);
                if (data.Any())
                {
                    double median = CalculateMedian(data);
                    results.Add(new MedianResult
                    {
                        FileName = fileName,
                        Median = median
                    });
                    medianList.Add(median);
                }
            }

            if (medianList.Any())
            {
                double overallMedian = CalculateMedian(medianList);
                results.Add(new MedianResult
                {
                    FileName = $"{folderName} Median of Medians",
                    Median = overallMedian
                });
            }
            else
            {
                results.Add(new MedianResult
                {
                    FileName = $"{folderName} No available data",
                    Median = 0
                });
            }

            return results;
        }

        private List<double> ExtractData(string fileName)
        {
            List<double> data = new List<double>();
            FileInfo fileInfo = new FileInfo(fileName);

            using (ExcelPackage package = new ExcelPackage(fileInfo))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                int startRow = 12;
                int rowCount = worksheet.Dimension.Rows;

                for (int row = startRow; row <= rowCount; row++)
                {
                    if (double.TryParse(worksheet.Cells[row, 2].Text, out double value))
                    {
                        data.Add(value);
                    }
                }
            }

            return data;
        }

        private double CalculateMedian(List<double> data)
        {
            data.Sort();
            int count = data.Count;
            return count % 2 == 0
                ? (data[count / 2 - 1] + data[count / 2]) / 2.0
                : data[count / 2];
        }
    }
}
