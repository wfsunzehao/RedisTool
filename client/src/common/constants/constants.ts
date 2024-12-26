import { Box, createTheme, Theme } from '@mui/material'
import { Button, keyframes, ListItem, ListItemText, Paper, styled } from '@mui/material'
import md5 from 'md5'

//订阅列表
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
//case列表
export const BVTTestCaseNames = [
    'FlushBladeTest',
    'DataAccessConfigurationBladeTest',
    'OverviewBladeTest',
    'AccessKeysBladeTest',
    'AdvancedSettingsBladeTest',
    'RebootBladeTest', //Need multiple shards
    'ScaleBladeTest',
    'ClusterSizeBladeTest',
    'DataPersistenceBladeTest-NotPremium', //NotPremium
    'DataPersistenceBladeTest-Premium',
    'ManagedIdentityBladeTest',
    'ScheduleUpdatesBladeTest',
    'GeoreplicationBladeTest', //Need two caches
    'VirtualNetworkBladeTest',
    //"PrivateEndpointBladeTest", //Could not be create
    'FirewallBladeTest',
    'PropertiesBladeTest',
    'Import-ExportBladeTest',
    'PortalOwnedBladeTest',
    'LocalizationTest',
]
//case列表
export const ManualTestCaseNames = ['8672', '8659', '8673']
export const user = {
    avatar: `https://www.gravatar.com/avatar/${md5('v-xinzhang6@microsoft.com')}?d=identicon`, // d=identicon 代表如果没有找到对应的头像，会返回一个默认的图标头像
    username: 'Zhang Xin', // 用户名
    email: 'v-xinzhang6@microsoft.com', // 用户邮箱
}

export const Overlay = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明黑色
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // 确保覆盖在其他元素之上
})
// constants.ts

export const loginTextStyles = {
    ml: 2,
    color: (theme: Theme) => theme.palette.common.white, // 使用 theme 动态设置颜色
    fontWeight: 'bold', // 加粗
    fontSize: '1rem', // 字体大小
    //textTransform: 'uppercase', // 转换为大写
    letterSpacing: 1.0, // 字母间距
    textAlign: 'center', // 居中对齐
    //backgroundColor: 'rgba(0, 0, 0, 0.3)', // 背景透明色
    padding: '5px 15px', // 内边距
    borderRadius: '20px', // 圆角
}

// 创建主题
export const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#ff4081',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
            fontWeight: 700,
            color: '#2c3e50',
        },
        h6: {
            fontWeight: 600,
            color: '#34495e',
        },
        body1: {
            fontWeight: 400,
            color: '#555',
        },
    },
})

const slideInAnimation = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`

// 创建点击动画
const clickAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
`

export const StyledPaper = styled(Paper)`
    padding: 20px;
    border-radius: 10px;
    transition: background-color 0.3s;
    animation: ${slideInAnimation} 0.5s ease-in-out;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
`

export const StyledListItem = styled(ListItem)`
    transition: background-color 0.3s;
    &:hover {
        background-color: #e0f7fa;
    }
    &:active {
        animation: ${clickAnimation} 0.2s ease-in-out;
    }
`

export const StyledListItemText = styled(ListItemText)`
    text-align: left;
`

export const StyledButton = styled(Button)`
    transition: background-color 0.3s;
    &:hover {
        background-color: #1565c0;
    }
    &:active {
        animation: ${clickAnimation} 0.2s ease-in-out;
    }
`
