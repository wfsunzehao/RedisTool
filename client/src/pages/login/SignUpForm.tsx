import React from 'react'
import { Box, TextField, Button, Typography, useTheme, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '@/app/context/AuthContext'

const SignUpForm: React.FC = () => {
    const theme = useTheme()
    const { setCurrentForm } = useAuth()

    const handleClose = () => {
        setCurrentForm('login') // 关闭表单
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <Box
                sx={{
                    position: 'relative', // 设置相对定位，确保 X 按钮相对这个容器定位
                    width: 500,
                    padding: 5,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    boxShadow: theme.shadows[6],
                    color: theme.palette.text.primary,
                    border: `1px solid rgba(255, 255, 255, 0.6)`,
                }}
            >
                {/* Close button */}
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        color: theme.palette.text.primary,
                        '&:hover': {
                            color: theme.palette.error.main,
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Sign Up
                </Typography>

                <TextField
                    fullWidth
                    label="Email address"
                    margin="normal"
                    type="email"
                    variant="outlined"
                    InputProps={{
                        style: { color: theme.palette.text.primary },
                    }}
                    InputLabelProps={{
                        style: { color: theme.palette.text.secondary },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: theme.palette.grey[400],
                            },
                            '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: theme.palette.primary.dark,
                            },
                        },
                    }}
                />
                <TextField
                    fullWidth
                    label="Password"
                    margin="normal"
                    type="password"
                    variant="outlined"
                    InputProps={{
                        style: { color: theme.palette.text.primary },
                    }}
                    InputLabelProps={{
                        style: { color: theme.palette.text.secondary },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: theme.palette.grey[400],
                            },
                            '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: theme.palette.primary.dark,
                            },
                        },
                    }}
                />
                <TextField
                    fullWidth
                    label="Confirm Password"
                    margin="normal"
                    type="password"
                    variant="outlined"
                    InputProps={{
                        style: { color: theme.palette.text.primary },
                    }}
                    InputLabelProps={{
                        style: { color: theme.palette.text.secondary },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: theme.palette.grey[400],
                            },
                            '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: theme.palette.primary.dark,
                            },
                        },
                    }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1.2rem',
                        padding: '12px',
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    }}
                >
                    Sign Up
                </Button>

                <Typography
                    variant="body1"
                    sx={{
                        marginTop: 3,
                        color: theme.palette.text.secondary,
                        textAlign: 'center',
                        fontStyle: 'italic',
                    }}
                >
                    Enter <strong>email</strong>, <strong>password</strong> and <strong>confirm password</strong>
                </Typography>
            </Box>
        </Box>
    )
}

export default SignUpForm
