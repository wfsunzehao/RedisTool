import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'

// 定义 AuthContext 的类型
interface AuthContextType {
    isLoggedIn: boolean
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    token: string | null
    setToken: React.Dispatch<React.SetStateAction<string | null>>
    currentForm: 'login' | 'signup' | 'forgotPassword'
    setCurrentForm: React.Dispatch<React.SetStateAction<'login' | 'signup' | 'forgotPassword'>>
    role: 'admin' | 'user'
    setRole: React.Dispatch<React.SetStateAction<'admin' | 'user'>>
    name: string
    setName: React.Dispatch<React.SetStateAction<string>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider 组件，提供所有与认证相关的状态
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'))
    const [currentForm, setCurrentForm] = useState<'login' | 'signup' | 'forgotPassword'>('login')
    const [role, setRole] = useState<'admin' | 'user'>('user') // 默认角色是普通用户
    const [name, setName] = useState<string>('') // 管理用户名

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true) // 如果有 token，则设置为已登录
        }
    }, [token])

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                token,
                setToken,
                currentForm,
                setCurrentForm,
                role,
                setRole,
                name,
                setName,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// 自定义 hook 用于访问 AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
