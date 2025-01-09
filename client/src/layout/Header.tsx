import React, { useState } from 'react'
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    List,
    ListItem,
    Badge,
    Avatar,
    Popover,
    Divider,
    Typography,
    MenuItem,
    Tooltip,
} from '@mui/material'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import ChatIcon from '@mui/icons-material/Chat'
import { useTheme } from '../app/context/ThemeContext'
import logo from '@/assets/images/wicrecend3.png'
import { useAuth } from '../app/context/AuthContext'
import { Switch } from '@nextui-org/react'

import { IconBrandAzure } from '@tabler/icons-react'
import { IconSun, IconMoon, IconLinkPlus } from '@tabler/icons-react'
import { loginTextStyles, user } from '../common/constants/constants'
import MessageHandler from './MessageHandler'
import LogoutMenu from './LogoutMenu'

const midLinks = [
    { title: 'Tests', path: '/create' },
    { title: 'Actions', path: '/delete' },
    { title: 'Tools', path: '/more' },
]

const navStyles = (theme: any) => ({
    color: theme.palette.mode === 'dark' ? '#fff' : 'inherit', // 黑暗模式下为白色
    textDecoration: 'none',
    typography: 'h6',
    marginRight: '20px',
    '&:hover': {
        textDecoration: 'underline',
    },
    '&.active': {
        fontWeight: 'bold',
        color: theme.palette.mode === 'dark' ? '#90caf9' : '#033c67', // 根据模式调整选中状态颜色
    },
})

const fixedMessages = [
    { title: 'System Update', content: 'The system will undergo maintenance tonight at 10 PM.' },
    { title: 'New Feature Released', content: 'Check out our latest feature in the dashboard!' },
    { title: 'Reminder', content: "Don't forget to submit your monthly report by Friday." },
]

// 获取头部样式的逻辑
const getHeaderStyles = (isHomePage: boolean, isDarkMode: boolean) => {
    return {
        backgroundColor: isHomePage
            ? isDarkMode
                ? '#333333' // 主页且黑暗模式
                : '#1976d2' // 主页且亮色模式
            : isDarkMode
              ? '#333333' // 非主页且黑暗模式
              : '#ffffff', // 非主页且亮色模式
        color: isHomePage
            ? isDarkMode
                ? '#ffffff' // 主页且黑暗模式
                : '#ffffff' // 主页且亮色模式
            : isDarkMode
              ? '#ffffff' // 非主页且黑暗模式
              : '#333333', // 非主页且亮色模式
    }
}
const getHeaderStyles2 = (isHomePage: boolean, isDarkMode: boolean) => {
    return {
        backgroundColor: isDarkMode
            ? '#333333' // 黑暗模式
            : '#1976d2', // 亮色模式
    }
}

// 获取Logo过滤色的逻辑
const getLogoFilter = (isHomePage: boolean, isDarkMode: boolean) => {
    // 主页时，Logo总是使用反色滤镜
    if (isHomePage) {
        return 'invert(100%) sepia(100%) saturate(0%) hue-rotate(180deg)'
    }

    // 非主页时，根据黑暗模式决定是否使用反色滤镜
    return isDarkMode
        ? 'invert(100%) sepia(100%) saturate(0%) hue-rotate(180deg)' // 黑暗模式使用反色滤镜
        : 'none' // 亮色模式不使用滤镜
}
const getLogoFilter2 = (isHomePage: boolean, isDarkMode: boolean) => {
    // 主页时，Logo总是使用反色滤镜

    // 非主页时，根据黑暗模式决定是否使用反色滤镜
    return 'invert(100%) sepia(100%) saturate(0%) hue-rotate(180deg)' // 黑暗模式使用反色滤镜
    // 亮色模式不使用滤镜
}

export default function Header() {
    const { toggleTheme, isDarkMode } = useTheme()

    const { isLoggedIn, setIsLoggedIn, name } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const isHomePage = location.pathname === '/'

    const [logoutAnchorEl, setLogoutAnchorEl] = useState<HTMLElement | null>(null)

    const [isNotificationOpen, setIsNotificationOpen] = useState(false)

    const handleChatIconClick = () => {
        setIsNotificationOpen((prev) => !prev) // 切换打开或关闭状态
    }

    const handleNotificationClose = () => {
        setIsNotificationOpen(false)
    }

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setLogoutAnchorEl(event.currentTarget)
    }

    const openLogoutMenu = Boolean(logoutAnchorEl)

    // 获取头部的样式
    const headerStyles = getHeaderStyles2(isHomePage, isDarkMode)
    const logoFilter = getLogoFilter2(isHomePage, isDarkMode)
    const handleAzureClick = () => {
        window.open('https://ms.portal.azure.com/?l=en.en-us#home', '_blank')
    }
    const handleLinksClick = () => {
        window.open(
            'https://msazure.visualstudio.com/RedisCache/_testPlans/execute?planId=15317840&suiteId=15317858',
            '_blank'
        )
    }

    return (
        <AppBar position="sticky" sx={{ ...headerStyles, boxShadow: 2 }}>
            {/*, paddingLeft: "40px", paddingRight: "40px"  */}
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
                {/* 左侧 Logo 和主题切换 */}
                <Box display="flex" alignItems="center">
                    <NavLink to="/" style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                maxHeight: 40,
                                objectFit: 'contain',
                                filter: logoFilter, // 应用过滤逻辑
                            }}
                        />
                    </NavLink>
                    <Box sx={{ mx: 1 }} /> {/* 添加统一间距 */}
                    <Tooltip
                        title="Toggle Dark Mode"
                        slotProps={{
                            tooltip: {
                                sx: {
                                    backdropFilter: 'blur(10px)', // 背景模糊效果
                                    color: 'rgba(112, 114, 145, 0.9)', // 文字颜色
                                    fontSize: '14px', // 文字大小
                                    fontWeight: 'bold', // 文字加粗
                                    borderRadius: 4, // 更圆滑的边框
                                    padding: '8px 12px', // 内边距
                                    border: `1px solid rgba(247, 240, 240, 0)`, // 完全透明边框
                                    backgroundColor: 'rgba(247, 240, 240, 0)', // 完全透明背景
                                    // boxShadow: "0px 4px 10px rgba(245, 241, 241, 0.80)", // 可选：阴影（如果需要阴影，可以开启）
                                },
                            },
                        }}
                    >
                        <Switch
                            checked={isDarkMode}
                            onChange={toggleTheme}
                            size="lg"
                            thumbIcon={({ isSelected }) =>
                                isSelected ? <IconMoon stroke={2} /> : <IconSun stroke={2} />
                            }
                        />
                    </Tooltip>
                    <Box sx={{ mx: 1 }} /> {/* 添加统一间距 */}
                    <Tooltip
                        title="Open Azure Portal"
                        slotProps={{
                            tooltip: {
                                sx: {
                                    backdropFilter: 'blur(10px)', // 背景模糊效果
                                    color: 'rgba(112, 114, 145, 0.9)', // 文字颜色
                                    fontSize: '14px', // 文字大小
                                    fontWeight: 'bold', // 文字加粗
                                    borderRadius: 4, // 更圆滑的边框
                                    padding: '8px 12px', // 内边距
                                    border: `1px solid rgba(247, 240, 240, 0)`, // 完全透明边框
                                    backgroundColor: 'rgba(247, 240, 240, 0)', // 完全透明背景
                                    // boxShadow: "0px 4px 10px rgba(245, 241, 241, 0.80)", // 可选：阴影（如果需要阴影，可以开启）
                                },
                            },
                        }}
                    >
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            onClick={handleAzureClick} // 点击时跳转到 Azure
                        >
                            <IconBrandAzure stroke={2} />
                        </IconButton>
                    </Tooltip>
                    <Box sx={{ mx: 1 }} /> {/* 添加统一间距 */}
                    <Tooltip
                        title="View More Links"
                        slotProps={{
                            tooltip: {
                                sx: {
                                    backdropFilter: 'blur(10px)', // 背景模糊效果
                                    color: 'rgba(112, 114, 145, 0.9)', // 文字颜色
                                    fontSize: '14px', // 文字大小
                                    fontWeight: 'bold', // 文字加粗
                                    borderRadius: 4, // 更圆滑的边框
                                    padding: '8px 12px', // 内边距
                                    border: `1px solid rgba(247, 240, 240, 0)`, // 完全透明边框
                                    backgroundColor: 'rgba(247, 240, 240, 0)', // 完全透明背景
                                    // boxShadow: "0px 4px 10px rgba(245, 241, 241, 0.80)", // 可选：阴影（如果需要阴影，可以开启）
                                },
                            },
                        }}
                    >
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            onClick={handleLinksClick} // 点击时跳转到相关链接
                        >
                            <IconLinkPlus stroke={2} />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* 右侧用户头像和消息图标 */}
                <Box display="flex" alignItems="center">
                    {isLoggedIn && (
                        <>
                            {/* 中间导航链接，仅在用户登录时显示 */}
                            <List sx={{ display: 'flex', padding: 0 }}>
                                {midLinks.map(({ title, path }) => (
                                    <ListItem
                                        component={NavLink}
                                        to={path}
                                        key={path}
                                        sx={navStyles}
                                        onClick={(event) => event.stopPropagation()} // 阻止冒泡
                                    >
                                        {title}
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}

                    {/* 分割线 */}
                    <Divider orientation="vertical" sx={{ height: '25px', marginRight: 2 }} />

                    {isLoggedIn && (
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            sx={{ mr: 2 }}
                            onClick={handleChatIconClick}
                        >
                            <Badge color="secondary">
                                <ChatIcon />
                            </Badge>
                        </IconButton>
                    )}
                    <MessageHandler isOpen={isNotificationOpen} onClose={handleNotificationClose} />
                    {isLoggedIn ? (
                        <Box display="flex" alignItems="center" sx={{ marginLeft: 2 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: '500',
                                    fontSize: '16px',
                                    color: headerStyles, // 使用动态颜色
                                    marginRight: '10px',
                                }}
                            >
                                {name}
                            </Typography>
                            <Avatar
                                sx={{
                                    width: 42,
                                    height: 42,
                                    cursor: 'pointer',
                                    borderRadius: '50%',
                                    border: '2px solid',
                                    borderColor: isDarkMode ? '#ffffff' : '#1976d2',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                                src={user.avatar}
                                alt="User Avatar"
                                onClick={handleAvatarClick}
                            />
                        </Box>
                    ) : (
                        <Typography variant="body2" sx={loginTextStyles}>
                            Please log in
                        </Typography>
                    )}

                    <LogoutMenu
                        anchorEl={logoutAnchorEl}
                        open={openLogoutMenu}
                        onClose={() => setLogoutAnchorEl(null)}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    )
}
