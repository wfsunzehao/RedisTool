namespace redis.WebAPi.Model
{
    public static class BVTTestCaseName
    {
        public static readonly string[] BVTTestCaseNames = {
        "FlushBladeTest",
        "DataAccessConfigurationBladeTest",
        "OverviewBladeTest",
        "AccessKeysBladeTest",
        "AdvancedSettingsBladeTest",
        "RebootBladeTest", //Need multiple shards
        "ScaleBladeTest",
        "ClusterSizeBladeTest",
        "DataPersistenceBladeTest-NotPremium", //NotPremium
        "DataPersistenceBladeTest-Premium",
        "ManagedIdentityBladeTest",
        "ScheduleUpdatesBladeTest",
        "GeoreplicationBladeTest", //Need two caches
        "VirtualNetworkBladeTest",
        //"PrivateEndpointBladeTest", //Could not be create
        "FirewallBladeTest",
        "PropertiesBladeTest",
        "Import-ExportBladeTest",
        "PortalOwnedBladeTest",
        "LocalizationTest"
        };
    }


}
