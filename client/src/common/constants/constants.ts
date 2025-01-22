import md5 from 'md5'

// Subscription list
export const subscriptionList = [
    {
        value: '1e57c478-0901-4c02-8d35-49db234b78d2',
        label: 'Cache Team - Vendor CTI Testing 2',
    },
    {
        value: '32353108-c7dc-4873-9ce8-a7d4d731673d',
        label: 'CacheTeam - RedisTiP',
    },
    {
        value: 'fc2f20f5-602a-4ebd-97e6-4fae3f1f6424',
        label: 'CacheTeam - Redis Perf and Stress Resources',
    },
]

// Test case list
export const BVTTestCaseNames = [
    'FlushBladeTest',
    'DataAccessConfigurationBladeTest',
    'OverviewBladeTest',
    'AccessKeysBladeTest',
    'AdvancedSettingsBladeTest',
    'RebootBladeTest', // Need multiple shards
    'ScaleBladeTest',
    'ClusterSizeBladeTest',
    'DataPersistenceBladeTest-NotPremium', // NotPremium
    'DataPersistenceBladeTest-Premium',
    'ManagedIdentityBladeTest',
    'ScheduleUpdatesBladeTest',
    'GeoreplicationBladeTest', // Need two caches
    'VirtualNetworkBladeTest',
    //"PrivateEndpointBladeTest", // Could not be created
    'FirewallBladeTest',
    'PropertiesBladeTest',
    'Import-ExportBladeTest',
    'PortalOwnedBladeTest',
    'LocalizationTest',
]

// Test case list for manual tests
export const ManualTestCaseNames = ['8672', '8659', '8673']

export const user = {
    avatar: `https://www.gravatar.com/avatar/${md5('v-xinzhang6@microsoft.com')}?d=identicon`, // d=identicon means if no matching avatar is found, it will return a default icon avatar
    username: 'Zhang Xin', // Username
    email: 'v-xinzhang6@microsoft.com', // User email
}
