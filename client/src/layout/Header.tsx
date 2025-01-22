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
import { user } from '../common/constants/constants'
import MessageHandler from './MessageHandler'
import LogoutMenu from './LogoutMenu'
import { loginTextStyles } from '@/common/styles/loginTextStyles'

const midLinks = [
    { title: 'Tests', path: '/create' },
    { title: 'Actions', path: '/delete' },
    { title: 'Tools', path: '/more' },
]

const navStyles = (theme: any) => ({
    color: theme.palette.mode === 'dark' ? '#fff' : 'inherit', // White in dark mode
    textDecoration: 'none',
    typography: 'h6',
    marginRight: '20px',
    '&:hover': {
        textDecoration: 'underline',
    },
    '&.active': {
        fontWeight: 'bold',
        color: theme.palette.mode === 'dark' ? '#90caf9' : '#033c67', // Adjust selected state color based on mode
    },
})

const fixedMessages = [
    { title: 'System Update', content: 'The system will undergo maintenance tonight at 10 PM.' },
    { title: 'New Feature Released', content: 'Check out our latest feature in the dashboard!' },
    { title: 'Reminder', content: "Don't forget to submit your monthly report by Friday." },
]

const getHeaderStyles2 = (isDarkMode: boolean) => {
    return {
        backgroundColor: isDarkMode
            ? '#333333' // Dark mode
            : '#1976d2', // Light mode
    }
}

const getLogoFilter2 = () => {
    // The logo always uses an inverted filter on the homepage

    // On non-homepages, decide whether to use an inverted filter based on dark mode
    return 'invert(100%) sepia(100%) saturate(0%) hue-rotate(180deg)' // Use inverted filter in dark mode
    // Do not use filter in light mode
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
        setIsNotificationOpen((prev) => !prev) // Toggle open or close state
    }

    const handleNotificationClose = () => {
        setIsNotificationOpen(false)
    }

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setLogoutAnchorEl(event.currentTarget)
    }

    const openLogoutMenu = Boolean(logoutAnchorEl)

    // Get the styles for the header
    const headerStyles = getHeaderStyles2(isDarkMode)
    const logoFilter = getLogoFilter2()
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
                {/* Left: Logo and theme switch */}
                <Box display="flex" alignItems="center">
                    <NavLink to="/" style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                maxHeight: 40,
                                objectFit: 'contain',
                                filter: logoFilter, // Apply filter logic
                            }}
                        />
                    </NavLink>
                    <Box sx={{ mx: 1 }} /> {/* Add uniform spacing */}
                    <Tooltip
                        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        slotProps={{
                            tooltip: {
                                sx: {
                                    backdropFilter: 'blur(10px)', // Background blur effect
                                    color: 'rgba(112, 114, 145, 0.9)', // Text color
                                    fontSize: '14px', // Text size
                                    fontWeight: 'bold', // Bold text
                                    borderRadius: 4, // Rounded border
                                    padding: '8px 12px', // Padding
                                    border: `1px solid rgba(247, 240, 240, 0)`, // Fully transparent border
                                    backgroundColor: 'rgba(247, 240, 240, 0)', // Fully transparent background
                                    // Optional: Shadow (enable if needed)
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
                    <Box sx={{ mx: 1 }} /> {/* Add uniform spacing */}
                    <Tooltip
                        title="Open Azure Portal"
                        slotProps={{
                            tooltip: {
                                sx: {
                                    backdropFilter: 'blur(10px)',
                                    color: 'rgba(112, 114, 145, 0.9)',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    borderRadius: 4,
                                    padding: '8px 12px',
                                    border: `1px solid rgba(247, 240, 240, 0)`,
                                    backgroundColor: 'rgba(247, 240, 240, 0)',
                                },
                            },
                        }}
                    >
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            onClick={handleAzureClick} // Click to jump to Azure
                        >
                            <IconBrandAzure stroke={2} />
                        </IconButton>
                    </Tooltip>
                    <Box sx={{ mx: 1 }} /> {/* Add uniform spacing */}
                    <Tooltip
                        title="View More Links"
                        slotProps={{
                            tooltip: {
                                sx: {
                                    backdropFilter: 'blur(10px)',
                                    color: 'rgba(112, 114, 145, 0.9)',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    borderRadius: 4,
                                    padding: '8px 12px',
                                    border: `1px solid rgba(247, 240, 240, 0)`,
                                    backgroundColor: 'rgba(247, 240, 240, 0)',
                                },
                            },
                        }}
                    >
                        <IconButton size="large" edge="end" color="inherit" onClick={handleLinksClick}>
                            <IconLinkPlus stroke={2} />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Right: User avatar and message icon */}
                <Box display="flex" alignItems="center">
                    {isLoggedIn && (
                        <>
                            {/* Middle navigation links, displayed only when the user is logged in */}
                            <List sx={{ display: 'flex', padding: 0 }}>
                                {midLinks.map(({ title, path }) => (
                                    <ListItem
                                        component={NavLink}
                                        to={path}
                                        key={path}
                                        sx={navStyles}
                                        onClick={(event) => event.stopPropagation()} // Prevent bubbling
                                    >
                                        {title}
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}

                    {/* Divider */}
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
                                    color: headerStyles,
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
