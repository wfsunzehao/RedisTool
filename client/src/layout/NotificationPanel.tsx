import React from 'react'
import { Box, Typography, List, ListItem, IconButton, Card, CardContent } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTheme } from '@mui/material/styles'

// Props for the notification panel
interface NotificationPanelProps {
    messages: { title: string; content: string }[]
    onClose: () => void
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ messages, onClose }) => {
    const theme = useTheme() // Get the current theme

    // Determine the text color based on the theme mode (dark mode uses white text, otherwise black)
    const textColor = theme.palette.mode === 'dark' ? 'white' : 'black'
    const contentColor = theme.palette.mode === 'dark' ? 'gray' : 'text.secondary'

    return (
        <Box
            sx={{
                position: 'fixed',
                top: '64px',
                right: 0,
                width: 350,
                height: '100vh',
                bgcolor: 'background.paper',
                boxShadow: 3,
                zIndex: 1300,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '8px 0 0 8px',
                overflow: 'hidden',
                transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderBottom: '2px solid',
                    borderColor: 'divider',
                }}
            >
                <Typography variant="h6" sx={{ color: textColor, fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Notifications
                </Typography>
                <IconButton onClick={onClose} sx={{ color: textColor }} aria-label="Close notification panel">
                    <CloseIcon />
                </IconButton>
            </Box>
            {/* Message List */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
                        borderRadius: '4px',
                    },
                }}
            >
                {messages.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <Typography variant="body1" sx={{ color: contentColor }}>
                            No new notifications
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {messages.map((message, index) => (
                            <ListItem key={index}>
                                <Card
                                    sx={{
                                        width: '100%',
                                        marginBottom: 1,
                                        boxShadow: 1,
                                        borderRadius: 2,
                                        bgcolor:
                                            theme.palette.mode === 'dark' ? 'background.default' : 'background.paper',
                                        '&:hover': {
                                            boxShadow: 6, // Hover effect: increase shadow
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            sx={{
                                                color: theme.palette.mode === 'dark' ? 'white' : 'primary.main',
                                                fontWeight: 'bold',
                                                fontSize: '1.3rem', // Larger font size
                                                marginBottom: 0.5,
                                                letterSpacing: '0.5px',
                                            }}
                                        >
                                            {message.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: contentColor,
                                                fontSize: '1rem', // Slightly smaller font size
                                                fontWeight: 400,
                                                lineHeight: 1.6,
                                                letterSpacing: '0.3px',
                                            }}
                                        >
                                            {message.content}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </Box>
    )
}

export default NotificationPanel
