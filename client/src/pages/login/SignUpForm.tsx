import React, { useState } from 'react'
import { Box, TextField, Button, Typography, useTheme, IconButton, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '@/app/context/AuthContext'
import agent from '@/app/api/agent'

const SignUpForm: React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'error' | 'success'; content: string } | null>(null)
    const theme = useTheme()
    const { setCurrentForm } = useAuth()

    const handleClose = () => {
        setCurrentForm('login') // Close the form
    }
    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)
        setMessage(null) // Reset message state
        try {
            const response = await agent.Auth.register(username, password)
            setMessage({ type: 'success', content: 'Register successful!' })
        } catch (error) {
            const errorMessage =
                (error as { data: { message: string } })?.data?.message ||
                'Failed to register. Please check your details.'
            setMessage({ type: 'error', content: errorMessage })
        } finally {
            setIsLoading(false)
        }
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
                    position: 'relative', // Set relative positioning to ensure X button is positioned relative to this container
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

                <form onSubmit={handleRegister}>
                    <TextField
                        required
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        margin="normal"
                        type="text"
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
                        disabled={isLoading}
                    />
                    <TextField
                        fullWidth
                        required
                        label="Password"
                        margin="normal"
                        value={password}
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
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    {/* <TextField
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
                    /> */}

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit" // Add this attribute to submit the form
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
                        {isLoading ? (
                            <CircularProgress
                                sx={{
                                    color: theme.palette.primary.contrastText,
                                }}
                            />
                        ) : (
                            'Sign up'
                        )}
                    </Button>
                </form>
                {message && (
                    <Typography
                        variant="body2"
                        sx={{
                            marginTop: 2,
                            textAlign: 'center',
                            color: message.type === 'error' ? theme.palette.error.main : theme.palette.success.main,
                        }}
                    >
                        {message.content}
                    </Typography>
                )}

                <Typography
                    variant="body1"
                    sx={{
                        marginTop: 3,
                        color: theme.palette.text.secondary,
                        textAlign: 'center',
                        fontStyle: 'italic',
                    }}
                >
                    Enter <strong>Username</strong>, <strong>password</strong> and <strong>confirm password</strong>
                </Typography>
            </Box>
        </Box>
    )
}

export default SignUpForm
