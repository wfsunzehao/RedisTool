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
    const { setIsLoggedIn, role, setCurrentForm } = useAuth() // 获取 role

    // 登出逻辑
    const handleLogout = () => {
        localStorage.removeItem('authToken')
        setIsLoggedIn(false)
        onClose()
        navigate('/')
        setCurrentForm('login') // 设置当前表单为注册
    }

    // 注册跳转逻辑
    const handleRegister = () => {
        onClose()
        navigate('/') // 跳转到注册页面
        setCurrentForm('signup') // 设置当前表单为注册
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

            {/* 只有管理员角色才能看到注册选项 */}
            {role === 'admin' && <MenuItem onClick={handleRegister}>Register</MenuItem>}
        </Popover>
    )
}

export default LogoutMenu
