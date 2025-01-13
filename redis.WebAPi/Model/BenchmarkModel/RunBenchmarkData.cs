using System.ComponentModel.DataAnnotations;

namespace redis.WebAPi.Model{
public class Parameters
{
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Region is required.")]
        public string Region { get; set; }
        public string Description { get; set; }

        [Required(ErrorMessage = "Clients is required.")]
        public int Clients { get; set; }

        [Required(ErrorMessage = "Threads is required.")]
        public int Threads { get; set; }

        [Required(ErrorMessage = "Size is required.")]
        public int Size { get; set; }

        [Required(ErrorMessage = "Requests is required.")]
        public int Requests { get; set; }

        [Required(ErrorMessage = "Pipeline is required.")]
        public int Pipeline { get; set; }
        [Required(ErrorMessage = "Times is required.")]
        public int Times { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        public int Status { get; set; }
        public string TimeStamp { get; set; }
    }
public class RunBenchmarkData
{
        public string Name { get; set; }
        public string Primary { get; set; }
        public string Region { get; set; }
        public string Description { get; set; }
        public int Clients { get; set; }
        public int Threads { get; set; }
        public int Size { get; set; }
        public int Requests { get; set; }
        public int Pipeline { get; set; }
        public int Times { get; set; }
        public string TimeStamp { get; set; }
    }

}



