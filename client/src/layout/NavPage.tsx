import React, { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Box, Paper, List, ListItemText, ListItemIcon, ListItemButton, Alert, Collapse } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

interface LinkItem {
    title: string
    path: string
    icon?: JSX.Element
    subLinks?: LinkItem[]
}

interface NavPageProps {
    links: LinkItem[]
    defaultPath: string
    alertMessage: string
    children?: React.ReactNode
    sidebarWidth?: string
    childrenWidth?: string
    contentWidth?: string
    marginLeft?: string
    flexDirection?: 'row' | 'column'
    unrestrictedChildren?: boolean // 新增属性：是否取消 children 的大小限制
}

const NavPage: React.FC<NavPageProps> = ({
    links,
    defaultPath,
    alertMessage,
    children,
    sidebarWidth = '250px',
    childrenWidth = '30%',
    contentWidth = '40%',
    marginLeft = '200px',
    flexDirection = 'column',
    unrestrictedChildren = false, // 默认限制 children 大小
}) => {
    const location = useLocation()
    const navigate = useNavigate()
    const theme = useTheme()
    const currentTab = location.pathname.split('/').pop()

    const [openStates, setOpenStates] = React.useState<Record<string, boolean>>({})

    const unrestricted = ['/create/benchmark', '/create/statistics'].includes(location.pathname) //不限制宽度

    useEffect(() => {
        if (location.pathname === defaultPath.split('/').slice(0, -1).join('/')) {
            navigate(defaultPath)
        }
    }, [location.pathname, navigate, defaultPath])

    const isSelected = (path: string) => currentTab === path.split('/').pop()

    const toggleSubLinks = (title: string) => {
        setOpenStates((prev) => ({ ...prev, [title]: !prev[title] }))
    }

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
                    {links.map(({ title, path, icon, subLinks }) => (
                        <React.Fragment key={title}>
                            {/* 一级菜单 */}
                            <ListItemButton
                                component={subLinks ? 'div' : Link}
                                {...(subLinks ? {} : { to: path })}
                                selected={isSelected(path)}
                                onClick={subLinks ? () => toggleSubLinks(title) : undefined}
                            >
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText
                                    primary={title}
                                    primaryTypographyProps={{
                                        fontFamily: '"Poppins", "Roboto", Arial, sans-serif',
                                        fontWeight: 500,
                                        fontSize: '18px',
                                        color: theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
                                        letterSpacing: '0.5px',
                                    }}
                                />
                                {subLinks && (openStates[title] ? <ExpandLess /> : <ExpandMore />)}
                            </ListItemButton>

                            {/* 二级菜单 */}
                            {subLinks && (
                                <Collapse in={openStates[title]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {subLinks.map((subLink) => (
                                            <ListItemButton
                                                key={subLink.title}
                                                component={Link}
                                                to={subLink.path}
                                                sx={{
                                                    pl: 12, // 增加缩进
                                                    '&.Mui-selected': {
                                                        backgroundColor: theme.palette.action.hover,
                                                        '& .MuiListItemText-primary': {
                                                            fontWeight: 500,
                                                            color: theme.palette.primary.main,
                                                        },
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.action.selected,
                                                    },
                                                }}
                                                selected={isSelected(subLink.path)}
                                            >
                                                <ListItemText
                                                    primary={subLink.title}
                                                    primaryTypographyProps={{
                                                        fontFamily: '"Roboto", Arial, sans-serif',
                                                        fontSize: '14px', // 更小的字体
                                                        fontStyle: 'italic', // 斜体
                                                        color: theme.palette.text.secondary, // 更浅的颜色
                                                    }}
                                                />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Box>

            {/* 主要内容区域 */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: flexDirection,
                    alignItems: children ? 'flex-start' : 'center',
                    paddingTop: '20px',
                    marginLeft: marginLeft,
                }}
            >
                <Box
                    sx={{
                        width: unrestricted ? '100%' : contentWidth, // 动态调整宽度,
                        padding: '20px',
                        flexGrow: unrestricted ? 1 : 0,
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
                                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                fontSize: '15px',
                            },
                        }}
                    >
                        {alertMessage}
                    </Alert>
                    <Outlet />
                </Box>
                {children && (
                    <Box
                        sx={{
                            width: unrestrictedChildren ? 'auto' : childrenWidth, // 动态控制宽度
                            flexGrow: unrestrictedChildren ? 1 : 0, // 若不限制宽度则允许弹性增长
                            padding: '20px',
                            marginLeft: '20px',
                        }}
                    >
                        {children}
                    </Box>
                )}
            </Box>
        </Paper>
    )
}

export default NavPage
