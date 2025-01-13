using redis.WebAPi.Model.BenchmarkModel;

namespace redis.WebAPi.Service.IService
{
    public interface IConnectionVMService
    {
        Task<string> ConnectionVM(string name, string primary, int clients, int threads, int size, int requests, int pipeline, int times,string TimeStamp);
        
        //Task<string> ConnectionVM(ConnectionVMRequest request);
        

    }
}