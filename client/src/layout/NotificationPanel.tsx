import React from 'react'
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface NotificationPanelProps {
    messages: { title: string; content: string }[]
    onClose: () => void
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ messages, onClose }) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: '64px',
                right: 0,
                width: 300,
                height: '100vh',
                bgcolor: 'background.paper',
                boxShadow: 3,
                zIndex: 1300,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Typography variant="h6">Notifications</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <List>
                    {messages.map((message, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={message.title} secondary={message.content} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    )
}

export default NotificationPanel
