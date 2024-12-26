import React, { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Box, Paper, List, ListItemText, ListItemIcon, ListItemButton, Alert, useTheme } from '@mui/material'

interface NavPageProps {
    links: Array<{ title: string; path: string; icon: JSX.Element }>
    defaultPath: string
    alertMessage: string
    children?: React.ReactNode // 子元素
    sidebarWidth?: string // 侧边栏宽度，可以通过 props 自定义
    childrenWidth?: string // children 区域的宽度
    contentWidth?: string // 主内容区宽度
    marginLeft?: string // 调整 margin
    flexDirection?: 'row' | 'column' // 控制布局方向
}

const NavPage: React.FC<NavPageProps> = ({
    links,
    defaultPath,
    alertMessage,
    children,
    sidebarWidth = '250px', // 默认侧边栏宽度
    childrenWidth = '30%', // 默认 children 部分宽度
    contentWidth = '40%', // 默认主内容区宽度
    marginLeft = '200px', // 默认左侧导航栏的 margin
    flexDirection = 'column', // 默认纵向布局
}) => {
    const location = useLocation()
    const navigate = useNavigate()
    const theme = useTheme()
    const currentTab = location.pathname.split('/').pop()

    useEffect(() => {
        if (location.pathname === defaultPath.split('/').slice(0, -1).join('/')) {
            navigate(defaultPath)
        }
    }, [location.pathname, navigate, defaultPath])

    const isSelected = (path: string) => currentTab === path.split('/').pop()

    // 判断是否需要调整布局
    const hasChildren = Boolean(children)

    return (
        <Paper elevation={10} sx={{ height: '100vh', display: 'flex', border: '1px solid #ccc' }}>
            {/* 左侧导航栏 */}
            <Box
                sx={{
                    width: sidebarWidth,
                    borderRight: '1px solid #ccc',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    height: '100%',
                    overflowY: 'auto',
                }}
            >
                <List sx={{ paddingTop: '20px' }}>
                    {links.map(({ title, path, icon }) => (
                        <ListItemButton component={Link} to={path} selected={isSelected(path)} key={title}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText
                                primary={title}
                                primaryTypographyProps={{
                                    fontFamily: '"Poppins", "Roboto", Arial, sans-serif', // 设置全局字体
                                    fontWeight: 500, // 设置中等粗细
                                    fontSize: '18px', // 更大的字体
                                    color: theme.palette.mode === 'dark' ? '#fff' : '#1976d2', // 默认颜色
                                    letterSpacing: '0.5px', // 添加字母间距
                                }}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Box>

            {/* 主要内容区域 */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: flexDirection, // 根据是否有 children 调整布局
                    alignItems: hasChildren ? 'flex-start' : 'center',
                    paddingTop: '20px',
                    marginLeft: marginLeft, // 留出左侧导航栏的空间
                }}
            >
                {/* 主内容 */}
                <Box
                    sx={{
                        width: contentWidth, // 主内容区占据宽度
                        padding: '20px',
                    }}
                >
                    <Alert
                        severity="warning"
                        sx={{
                            width: '600px',
                            margin: '0 auto',
                            marginBottom: '16px',
                            '& .MuiAlert-message': {
                                fontFamily:
                                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', // 设置字体
                                //fontWeight: 'bold', // 设置字体粗细
                                fontSize: '15px', // 设置字体大小
                                //letterSpacing: '0.5px', // 设置字母间距
                            },
                        }}
                    >
                        {alertMessage}
                    </Alert>

                    <Outlet />
                </Box>

                {/* 右侧内容 */}
                {hasChildren && (
                    <Box
                        sx={{
                            width: childrenWidth, // 控制 children 部分的宽度
                            padding: '20px',
                            marginLeft: '20px', // 在 Outlet 和 children 之间留出空间
                        }}
                    >
                        {children} {/* 渲染传入的 children */}
                    </Box>
                )}
            </Box>
        </Paper>
    )
}

export default NavPage
