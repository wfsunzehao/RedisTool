import React, { useState } from 'react'
import { Box, TextField, Button, Typography, Link, useTheme, CircularProgress } from '@mui/material'
import { useAuth } from '@/app/context/AuthContext'
import agent from '@/app/api/agent'

const ForgotPasswordForm: React.FC = () => {
    const theme = useTheme()
    const { currentForm, setCurrentForm } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [message, setMessage] = useState<{ type: 'error' | 'success'; content: string } | null>(null)

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault() // Blocking Default Jump Behaviors
        setCurrentForm('login')
    }

    const handleForgot = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)
        setMessage(null) // Reset message state
        try {
            const response = await agent.Auth.changePassword(username, oldPassword, newPassword)
            setMessage({ type: 'success', content: 'Change successful!' })
        } catch (error) {
            const errorMessage =
                (error as { data: { message: string } })?.data?.message ||
                'Failed to change password. Please check your details.'
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
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        background:
                            theme.palette.mode === 'dark'
                                ? '#000000'
                                : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Forgot Password
                </Typography>

                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.secondary,
                    }}
                >
                    You have an account.{' '}
                    <Link
                        href="#"
                        sx={{
                            color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.primary.main,
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                                color: theme.palette.primary.dark,
                            },
                        }}
                        onClick={handleClick}
                    >
                        Sign in
                    </Link>
                </Typography>

                <form onSubmit={handleForgot}>
                    <TextField
                        required
                        fullWidth
                        label="Username"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                                backgroundColor: theme.palette.mode === 'dark' ? '#121212' : 'transparent',
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
                        label="Old password"
                        margin="normal"
                        value={oldPassword}
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
                                backgroundColor: theme.palette.mode === 'dark' ? '#121212' : 'transparent',
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
                        onChange={(e) => setOldPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    <TextField
                        fullWidth
                        required
                        label="New password"
                        margin="normal"
                        value={newPassword}
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
                                backgroundColor: theme.palette.mode === 'dark' ? '#121212' : 'transparent',
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
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isLoading}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
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
                            'Reset Password'
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
                        color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.secondary,
                        textAlign: 'center',
                        fontStyle: 'italic',
                    }}
                >
                    Enter <strong>email</strong> and <strong>password</strong>
                </Typography>
            </Box>
        </Box>
    )
}

export default ForgotPasswordForm
