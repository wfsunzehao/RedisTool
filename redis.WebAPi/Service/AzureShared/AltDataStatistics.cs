using System.ComponentModel;
using OfficeOpenXml;

namespace redis.WebAPi.Service.AzureShared
{
    public class AltDataStatistics
    {
        public void GetAltDataStatistics() 
        {
            string folderPath = "";
            for (int i = 0; i < 19; i++)
            {
                if (i < 7)
                {
                    folderPath = @"D:\LoadTestConfig\BC" + i.ToString() + "-latency"; // Replace with your folder path
                    getNum(folderPath, "BC" + i.ToString());
                }
                else if (7 <= i && i < 14)
                {
                    folderPath = @"D:\LoadTestConfig\SC" + (i - 7).ToString() + "-latency"; // Replace with your folder path
                    getNum(folderPath, "SC" + (i - 7).ToString());
                }
                else
                {
                    folderPath = @"D:\LoadTestConfig\P" + (i - 13).ToString() + "-latency"; // Replace with your folder path
                    getNum(folderPath, "P" + (i - 13).ToString());
                }
            }
        }
        static void getNum(string folderPath, string name)
        {
            string[] fileNames = Directory.GetFiles(folderPath, "*.xlsx"); // Get all files with .xlsx extension in the folder

            List<double> medianList = new List<double>(); // Stores a list of the medians of all the data in the file

            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;
            foreach (string fileName in fileNames)
            {
                FileInfo fileInfo = new FileInfo(fileName);
                using (ExcelPackage package = new ExcelPackage(fileInfo))
                {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[0]; // Select the worksheet to read (index starts at 0)

                    int startRow = 12; // Start row
                    int rowCount = worksheet.Dimension.Rows;

                    List<double> data = new List<double>(); // Create a list to store data

                    int colIndex = 2; // The index of the second column (index starts at 1)

                    for (int row = startRow; row <= rowCount; row++)
                    {
                        double value;
                        if (double.TryParse(worksheet.Cells[row, colIndex].Value?.ToString(), out value))
                        {
                            data.Add(value); // Storing data in a list
                        }
                    }

                    if (data.Count > 0)
                    {
                        double median = CalculateMedian(data); // Calculate the median of the data in the current file
                        Console.WriteLine("File: " + fileName + " Median: " + median); //Output the median of each excel file
                        medianList.Add(median); // Add the median to the list
                    }
                }
            }

            if (medianList.Count > 0)
            {
                double overallMedian = CalculateMedian(medianList); // Calculate the median of medians
                Console.WriteLine(name + "Median of medians: " + overallMedian);
            }
            else
            {
                Console.WriteLine("No data available");
            }
        }

        static double CalculateMedian(List<double> data)
        {
            int count = data.Count;
            int middleIndex = count / 2;

            double median;

            if (count % 2 == 0)
            {
                data.Sort();
                median = (data[middleIndex - 1] + data[middleIndex]) / 2.0;
            }
            else
            {
                data.Sort();
                median = data[middleIndex];
            }

            return median;
        }
    }
}
