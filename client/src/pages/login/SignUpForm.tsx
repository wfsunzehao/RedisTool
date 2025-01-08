import React from 'react'
import { Box, TextField, Button, Typography, Link, useTheme } from '@mui/material'
import { useAuth } from '@/app/context/AuthContext'

const SignUpForm: React.FC = () => {
    const theme = useTheme()
    const { currentForm, setCurrentForm } = useAuth()
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault() // 阻止默认跳转行为（如果需要）
        setCurrentForm('login')
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
                    Sign Up
                </Typography>

                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        color: theme.palette.text.secondary,
                    }}
                >
                    Already have an account?{' '}
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
                        onClick={handleClick}
                    >
                        Sign in
                    </Link>
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
