import React from 'react'
import { Popover, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../app/context/AuthContext'

interface LogoutMenuProps {
    anchorEl: HTMLElement | null
    open: boolean
    onClose: () => void
}

const LogoutMenu: React.FC<LogoutMenuProps> = ({ anchorEl, open, onClose }) => {
    const navigate = useNavigate()
    const { setIsLoggedIn, role, setCurrentForm } = useAuth() // Get the role

    // Logout logic
    const handleLogout = () => {
        localStorage.removeItem('authToken')
        setIsLoggedIn(false)
        onClose()
        navigate('/')
        setCurrentForm('login') // Set the current form to login
    }

    // Registration redirect logic
    const handleRegister = () => {
        onClose()
        navigate('/') // Redirect to the registration page
        setCurrentForm('signup') // Set the current form to signup
    }

    return (
        <Popover
            id="logout-popover"
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>

            {/* Only admin roles can see the register option */}
            {role === 'admin' && <MenuItem onClick={handleRegister}>Register</MenuItem>}
        </Popover>
    )
}

export default LogoutMenu
