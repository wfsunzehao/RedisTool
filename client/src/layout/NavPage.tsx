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
    count?: number
    alert?: string
}

interface NavPageProps {
    links: LinkItem[]
    defaultPath: string
    children?: React.ReactNode
    sidebarWidth?: string
    childrenWidth?: string
    contentWidth?: string
    marginLeft?: string
    flexDirection?: 'row' | 'column'
    unrestrictedChildren?: boolean // New property: whether to remove size restrictions for children
}

const NavPage: React.FC<NavPageProps> = ({
    links,
    defaultPath,
    children,
    sidebarWidth = '250px',
    childrenWidth = '30%',
    contentWidth = '40%',
    marginLeft = '200px',
    flexDirection = 'column',
    unrestrictedChildren = false, // Default to restrict children size
}) => {
    const location = useLocation()
    const navigate = useNavigate()
    const theme = useTheme()
    const currentTab = location.pathname.split('/').pop()

    const [openStates, setOpenStates] = React.useState<Record<string, boolean>>({})

    const unrestricted = ['/create/benchmark', '/create/statistics'].includes(location.pathname) // No width restriction

    useEffect(() => {
        if (location.pathname === defaultPath.split('/').slice(0, -1).join('/')) {
            navigate(defaultPath)
        }
    }, [location.pathname, navigate, defaultPath])

    const currentAlert = React.useMemo(() => {
        for (const link of links) {
            if (location.pathname.startsWith(link.path) && link.alert) {
                return link.alert
            }
            if (link.subLinks) {
                for (const subLink of link.subLinks) {
                    if (location.pathname.startsWith(subLink.path) && subLink.alert) {
                        return subLink.alert
                    }
                }
            }
        }
        return null
    }, [links, location.pathname])

    const isSelected = (path: string) => currentTab === path.split('/').pop()

    const toggleSubLinks = (title: string) => {
        setOpenStates((prev) => ({ ...prev, [title]: !prev[title] }))
    }

    return (
        <Paper elevation={10} sx={{ height: '100vh', display: 'flex', border: '1px solid #ccc' }}>
            {/* Left sidebar */}
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
                <List>
                    {links.map(({ title, path, icon, subLinks }) => (
                        <React.Fragment key={title}>
                            {/* Primary menu */}
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

                            {/* Secondary menu */}
                            {subLinks && (
                                <Collapse in={openStates[title]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {subLinks.map((subLink) => (
                                            <ListItemButton
                                                key={subLink.title}
                                                component={Link}
                                                to={subLink.path}
                                                selected={isSelected(subLink.path)}
                                                sx={{
                                                    pl: 8, // Increase indent
                                                    '&.Mui-selected': {
                                                        backgroundColor: theme.palette.action.hover,
                                                        '& .MuiListItemText-primary': {
                                                            fontWeight: 'bold',
                                                            color: theme.palette.primary.main,
                                                        },
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.action.selected,
                                                    },
                                                }}
                                            >
                                                {/* Number icon */}
                                                <ListItemIcon>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: theme.palette.primary.light,
                                                            color: theme.palette.common.white,
                                                            borderRadius: '50%',
                                                            width: '24px',
                                                            height: '24px',
                                                            fontSize: '12px',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {subLink.count}
                                                    </Box>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={subLink.title}
                                                    primaryTypographyProps={{
                                                        fontSize: '14px',
                                                        color: theme.palette.text.secondary,
                                                        fontStyle: 'italic',
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

            {/* Main content area */}
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
                        width: unrestricted ? '100%' : contentWidth, // Dynamically adjust width
                        padding: '20px',
                        flexGrow: unrestricted ? 1 : 0,
                    }}
                >
                    {/* Only show the alert box when alertMessage is passed in */}
                    <Box
                        sx={{
                            width: '600px',
                            margin: '0 auto',
                            marginBottom: '16px',
                            height: '60px', // 设置固定高度，确保显示/隐藏时占位一致
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {currentAlert ? (
                            <Alert
                                severity="warning"
                                sx={{
                                    width: '100%',
                                    '& .MuiAlert-message': {
                                        fontFamily:
                                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                        fontSize: '15px',
                                    },
                                }}
                            >
                                {currentAlert}
                            </Alert>
                        ) : (
                            // 用空内容占位
                            <Box sx={{ visibility: 'hidden', width: '100%', height: '100%' }} />
                        )}
                    </Box>

                    <Outlet />
                </Box>

                {children && (
                    <Box
                        sx={{
                            width: unrestrictedChildren ? 'auto' : childrenWidth, // Dynamically control width
                            flexGrow: unrestrictedChildren ? 1 : 0, // Allow flexible growth if no restriction
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
