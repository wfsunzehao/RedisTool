import React, { useState } from 'react'
import { Box, TextField, Button, Typography, Link, useTheme, CircularProgress } from '@mui/material'
import { useAuth } from '@/app/context/AuthContext'
import agent from '@/app/api/agent'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'

const ResetPasswordForm: React.FC = () => {
    const theme = useTheme()
    const { currentForm, setCurrentForm } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [message, setMessage] = useState<{ type: 'error' | 'success'; content: string } | null>(null)

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        setCurrentForm('login')
    }

    const handleReset = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsLoading(true)
        setMessage(null)
        try {
            await agent.Auth.resetPassword(username, newPassword)
            setMessage({ type: 'success', content: 'Password reset successful!' })
        } catch (error) {
            const errorMessage =
                (error as { data: { message: string } })?.data?.message ||
                'Failed to reset password. Please check the details or your permissions.'
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
                    position: 'relative',
                }}
            >
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: theme.palette.grey[700],
                    }}
                    onClick={() => {
                        setCurrentForm('login')
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
                        background:
                            theme.palette.mode === 'dark'
                                ? '#000000'
                                : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Reset Password
                </Typography>

                <form onSubmit={handleReset}>
                    <TextField
                        required
                        fullWidth
                        label="Username"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        variant="outlined"
                        disabled={isLoading}
                        InputProps={{ style: { color: theme.palette.text.primary } }}
                        InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#121212' : 'transparent',
                                '& fieldset': { borderColor: theme.palette.grey[400] },
                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.dark },
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        required
                        label="New password"
                        margin="normal"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type="password"
                        variant="outlined"
                        disabled={isLoading}
                        InputProps={{ style: { color: theme.palette.text.primary } }}
                        InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#121212' : 'transparent',
                                '& fieldset': { borderColor: theme.palette.grey[400] },
                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.dark },
                            },
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                        sx={{
                            marginTop: '30px',
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
                            <CircularProgress sx={{ color: theme.palette.primary.contrastText }} />
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
                    variant="body2"
                    sx={{
                        mt: 3,
                        textAlign: 'center',
                        fontStyle: 'italic',
                        color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.secondary,
                    }}
                >
                    Admin only: Provide <strong>Username</strong> and <strong>New Password</strong>
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        marginTop: 2,
                        textAlign: 'center',
                        color: theme.palette.mode === 'dark' ? '#000000' : theme.palette.text.secondary,
                    }}
                >
                    {/* Back to{' '}
                    <Link
                        href="#"
                        onClick={handleClick}
                        sx={{
                            fontWeight: 'bold',
                            color: theme.palette.primary.main,
                            '&:hover': {
                                textDecoration: 'underline',
                                color: theme.palette.primary.dark,
                            },
                        }}
                    >
                        Sign In
                    </Link> */}
                </Typography>
            </Box>
        </Box>
    )
}

export default ResetPasswordForm
