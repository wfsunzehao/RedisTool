import React, { useState, useEffect } from 'react'
import { Box, TextField, Button, Typography, Link, useTheme, CircularProgress } from '@mui/material'
import { useAuth } from '../../app/context/AuthContext'
import agent from '../../app/api/agent'
import { useNavigate } from 'react-router-dom'
import { useAuthState } from '@/app/context/AuthStateContext'

const LoginForm: React.FC = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const { setIsLoggedIn, setToken } = useAuth()
    const { currentForm, setCurrentForm } = useAuthState()
    const [isAdmin, setIsAdmin] = useState(false) // 管理员标志

    // 在组件加载时检查 token 的角色
    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (token) {
            try {
                const parsedToken = JSON.parse(atob(token.split('.')[1])) // 解码并解析 token
                const userRole = parsedToken.role // 假设角色信息存储在 token 的 'role' 字段
                if (userRole === 'admin') {
                    setIsAdmin(true) // 设置为管理员
                }
            } catch (error) {
                console.error('Token parsing error:', error)
            }
        }
    }, []) // 空依赖数组，确保只在组件加载时执行一次

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)
        setError('')
        setSuccess('')
        try {
            const response = await agent.Auth.login(username, password)
            localStorage.setItem('authToken', response.token)
            setToken(response.token)
            setIsLoggedIn(true)
            setSuccess('Login successful!')
            navigate('/create')
        } catch (error) {
            const errorMessage =
                (error as { data: { message: string } })?.data?.message || 'Invalid username or password.'
            setError(errorMessage)
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
                    {isAdmin && (
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
                            onClick={handleUpClick}
                        >
                            Sign up
                        </Link>
                    )}
                </Typography>

                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        required
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        margin="normal"
                        type="Username"
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
                    Enter <strong>email</strong> and <strong>password </strong>
                </Typography>
            </Box>
        </Box>
    )
}

export default LoginForm
