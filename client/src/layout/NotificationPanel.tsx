import React from 'react'
import { Box, Typography, List, ListItem, IconButton, Card, CardContent } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTheme } from '@mui/material/styles'

// 消息面板的 props
interface NotificationPanelProps {
    messages: { title: string; content: string }[]
    onClose: () => void
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ messages, onClose }) => {
    const theme = useTheme() // 获取当前主题

    // 判断当前主题模式，如果是暗黑模式，则使用白色字体，否则使用黑色字体
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
                borderRadius: '8px 0 0 8px', // 圆角效果
                overflow: 'hidden',
            }}
        >
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
                <IconButton onClick={onClose} sx={{ color: textColor }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <List>
                    {messages.map((message, index) => (
                        <ListItem key={index}>
                            <Card
                                sx={{
                                    width: '100%',
                                    marginBottom: 1,
                                    boxShadow: 1,
                                    borderRadius: 2,
                                    bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'background.paper',
                                    //transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        boxShadow: 6, // hover效果：增加阴影
                                    },
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        sx={{
                                            color: theme.palette.mode === 'dark' ? 'white' : 'primary.main',
                                            fontWeight: 'bold',
                                            fontSize: '1.3rem', // 更大字号
                                            marginBottom: 0.5,
                                            letterSpacing: '0.5px', // 增加字母间距让标题更有视觉层次
                                        }}
                                    >
                                        {message.title}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: contentColor,
                                            fontSize: '1rem', // 适度减少字号
                                            fontWeight: 400, // 使用更轻的字体
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
            </Box>
        </Box>
    )
}

export default NotificationPanel
