using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace redis.WebAPi.Service.AzureShared
{
    public enum EnterpriseCreateOption
    {
        Zones,
        Modules,
        Persistence_AOF,
        Persistence_RDB,
        Enterprise_Clustering
    }
}
