import React, { useState, useEffect } from 'react'
import { Box, TextField, Button, Typography, Link, useTheme, CircularProgress } from '@mui/material'
import { useAuth } from '../../app/context/AuthContext'
import agent from '../../app/api/agent'
import { useNavigate } from 'react-router-dom'

const LoginForm: React.FC = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'error' | 'success'; content: string } | null>(null)
    const { setIsLoggedIn, setToken, setCurrentForm, role, setRole } = useAuth()

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)
        setMessage(null) // Reset message state
        try {
            const response = await agent.Auth.login(username, password)
            localStorage.setItem('authToken', response.token)
            setToken(response.token)
            setIsLoggedIn(true)

            setRole(response.role) // 登录后更新角色

            setMessage({ type: 'success', content: 'Login successful!' })
            navigate('/create')
        } catch (error) {
            const errorMessage =
                (error as { data: { message: string } })?.data?.message || 'Invalid username or password.'
            setMessage({ type: 'error', content: errorMessage })
        } finally {
            setIsLoading(false)
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        setCurrentForm('forgotPassword')
    }

    const handleUpClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        setCurrentForm('signup')
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
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Sign In
                </Typography>

                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        color: theme.palette.text.secondary,
                    }}
                >
                    Don't have an account? {/* 只有管理员才能看到 Sign up */}
                    <Link
                        href="#"
                        sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                                color: theme.palette.primary.dark,
                            },
                        }}
                    >
                        Contact the administrator
                    </Link>
                </Typography>

                {message && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: message.type === 'error' ? theme.palette.error.main : theme.palette.success.main,
                            textAlign: 'center',
                            marginBottom: 2,
                        }}
                    >
                        {message.content}
                    </Typography>
                )}

                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        required
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
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                    <Link
                        href="#"
                        variant="body2"
                        sx={{
                            display: 'block',
                            marginBottom: 3,
                            textAlign: 'right',
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                textDecoration: 'underline',
                                color: theme.palette.primary.main,
                            },
                        }}
                        onClick={handleClick}
                    >
                        Forgot password?
                    </Link>

                    <Button
                        fullWidth
                        type="submit"
                        disabled={isLoading}
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
                        {isLoading ? (
                            <CircularProgress
                                sx={{
                                    color: theme.palette.primary.contrastText,
                                }}
                            />
                        ) : (
                            'Sign in'
                        )}
                    </Button>
                </form>

                <Typography
                    variant="body1"
                    sx={{
                        marginTop: 3,
                        color: theme.palette.text.secondary,
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

export default LoginForm
