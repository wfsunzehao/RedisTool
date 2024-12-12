using OfficeOpenXml;
using redis.WebAPi.Models;  // 引入数据模型类
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using redis.WebAPi.Filters;

namespace redis.WebAPi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(AuthFilter))]
    public class MedianController : ControllerBase
    {
        [HttpPost("sendMedianJson")]
        public IActionResult SendMedianJson([FromBody] FolderPathRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Path))
            {
                return BadRequest("Path cannot be empty");
            }

            string baseFolderPath = request.Path;
            if (!Directory.Exists(baseFolderPath))
            {
                return BadRequest($"The specified folder {baseFolderPath} does not exist");
            }

            List<string> resultMessages = new List<string>();
            List<MedianResult> allResults = new List<MedianResult>(); // Storing calculation results for all folders

            try
            {
                // Get all subfolders in the path
                string[] subDirectories = Directory.GetDirectories(baseFolderPath, "*", SearchOption.TopDirectoryOnly);

                // If there are no subfolders, process the files in the current folder directly
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
                    // Otherwise, process each subfolder
                    foreach (var subDirectory in subDirectories)
                    {
                        string[] fileNames = Directory.GetFiles(subDirectory, "*.xlsx", SearchOption.TopDirectoryOnly);
                        if (fileNames.Any())
                        {
                            allResults.AddRange(ProcessFiles(fileNames, new DirectoryInfo(subDirectory).Name));
                        }
                    }
                }

                // Generate Excel file and return
                var fileContent = GenerateExcelReport(allResults);
                var fileName = "Median_Report.xlsx";
                return File(fileContent, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing the folder", details = ex.Message });
            }
        }

        // Process the files in the folder, calculate the median for each file, and return the folder's median
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

        // Extract data from the Excel file
        private List<double> ExtractData(string fileName)
        {
            List<double> data = new List<double>();
            FileInfo fileInfo = new FileInfo(fileName);

            using (ExcelPackage package = new ExcelPackage(fileInfo))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                int startRow = 12; // Starting row
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

        // Calculate the median
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

        // Generate Excel report and return its content
        private byte[] GenerateExcelReport(List<MedianResult> results)
        {
            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Median Report");

                // Add header
                worksheet.Cells[1, 1].Value = "File Name";
                worksheet.Cells[1, 2].Value = "Median";

                // Fill in the data
                int row = 2;
                foreach (var result in results)
                {
                    worksheet.Cells[row, 1].Value = result.FileName;
                    worksheet.Cells[row, 2].Value = result.Median;
                    row++;
                }

                // Format column widths
                worksheet.Column(1).AutoFit();
                worksheet.Column(2).AutoFit();

                // Return the Excel file content
                return package.GetAsByteArray();
            }
        }
    }
}
