using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedianController : ControllerBase
    {
        [HttpPost("sendMedianJson")]
        public IActionResult SendMedianJson([FromBody] FolderPathRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Path))
            {
                return BadRequest("路径不能为空");
            }

            string baseFolderPath = request.Path;
            if (!Directory.Exists(baseFolderPath))
            {
                return BadRequest($"指定的文件夹 {baseFolderPath} 不存在");
            }

            List<string> resultMessages = new List<string>();
            List<MedianResult> allResults = new List<MedianResult>(); // 存储所有文件夹的计算结果

            try
            {
                // 获取路径下所有子文件夹
                string[] subDirectories = Directory.GetDirectories(baseFolderPath, "*", SearchOption.TopDirectoryOnly);

                // 如果没有子文件夹，则直接处理当前文件夹下的文件
                if (subDirectories.Length == 0)
                {
                    string[] fileNames = Directory.GetFiles(baseFolderPath, "*.xlsx", SearchOption.TopDirectoryOnly);
                    if (fileNames.Any())
                    {
                        allResults.AddRange(ProcessFiles(fileNames, new DirectoryInfo(baseFolderPath).Name));
                    }
                    else
                    {
                        resultMessages.Add($"当前文件夹 {baseFolderPath} 中没有 .xlsx 文件");
                    }
                }
                else
                {
                    // 否则，处理每个子文件夹
                    foreach (var subDirectory in subDirectories)
                    {
                        string[] fileNames = Directory.GetFiles(subDirectory, "*.xlsx", SearchOption.TopDirectoryOnly);
                        if (fileNames.Any())
                        {
                            allResults.AddRange(ProcessFiles(fileNames, new DirectoryInfo(subDirectory).Name));
                        }
                    }
                }

                // 生成 Excel 文件并返回
                var fileContent = GenerateExcelReport(allResults);
                var fileName = "Median_Report.xlsx";
                return File(fileContent, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "处理文件夹时发生错误", details = ex.Message });
            }
        }

        // 处理文件夹中的文件，计算每个文件的中位数，并返回文件夹的中位数
        private List<MedianResult> ProcessFiles(string[] fileNames, string folderName)
        {
            List<double> medianList = new List<double>();
            List<MedianResult> results = new List<MedianResult>();
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

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
                    FileName = $"{folderName} 中位数的中位数",
                    Median = overallMedian
                });
            }
            else
            {
                results.Add(new MedianResult
                {
                    FileName = $"{folderName} 没有可用数据",
                    Median = 0
                });
            }

            return results;
        }

        // 从 Excel 文件中提取数据
        private List<double> ExtractData(string fileName)
        {
            List<double> data = new List<double>();
            FileInfo fileInfo = new FileInfo(fileName);

            using (ExcelPackage package = new ExcelPackage(fileInfo))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                int startRow = 12; // 起始行
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

        // 计算中位数
        private double CalculateMedian(List<double> data)
        {
            data.Sort();
            int count = data.Count;
            if (count % 2 == 0)
            {
                return (data[count / 2 - 1] + data[count / 2]) / 2.0;
            }
            else
            {
                return data[count / 2];
            }
        }

        // 生成 Excel 报告并返回其内容
        private byte[] GenerateExcelReport(List<MedianResult> results)
        {
            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("中位数报告");

                // 添加表头
                worksheet.Cells[1, 1].Value = "文件名";
                worksheet.Cells[1, 2].Value = "中位数";

                // 填充数据
                int row = 2;
                foreach (var result in results)
                {
                    worksheet.Cells[row, 1].Value = result.FileName;
                    worksheet.Cells[row, 2].Value = result.Median;
                    row++;
                }

                // 格式化列宽
                worksheet.Column(1).AutoFit();
                worksheet.Column(2).AutoFit();

                // 返回 Excel 文件内容
                return package.GetAsByteArray();
            }
        }
    }

    // 用于接收前端请求的文件夹路径
    public class FolderPathRequest
    {
        public string Path { get; set; }
    }

    // 用于存储每个文件的中位数结果
    public class MedianResult
    {
        public string FileName { get; set; }
        public double Median { get; set; }
    }
}
