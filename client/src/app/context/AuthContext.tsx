import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Define the type for AuthContext
interface AuthContextType {
    isLoggedIn: boolean
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    token: string | null
    setToken: React.Dispatch<React.SetStateAction<string | null>>
    currentForm: 'login' | 'signup' | 'resetPassword'
    setCurrentForm: React.Dispatch<React.SetStateAction<'login' | 'signup' | 'resetPassword'>>
    role: 'admin' | 'user'
    setRole: React.Dispatch<React.SetStateAction<'admin' | 'user'>>
    name: string
    setName: React.Dispatch<React.SetStateAction<string>>
    justLoggedOut: boolean
    setJustLoggedOut: React.Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider component that provides all authentication-related state
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'))
    const [currentForm, setCurrentForm] = useState<'login' | 'signup' | 'resetPassword'>('login')
    const [role, setRole] = useState<'admin' | 'user'>('user') // Default role is a regular user
    const [name, setName] = useState<string>(localStorage.getItem('username') || '') // 从 localStorage 读name
    const [justLoggedOut, setJustLoggedOut] = useState<boolean>(false)
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('username')
        setToken(null)
        setName('')
        setIsLoggedIn(false)
        setRole('user')
        setCurrentForm('login')
        setJustLoggedOut(true) // 标记为刚登出
    }

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                const exp = payload.exp
                const now = Math.floor(Date.now() / 1000)
                if (exp && now >= exp) {
                    console.warn('Token expired. Logging out.')
                    logout()
                } else {
                    setIsLoggedIn(true)
                }
            } catch (err) {
                console.error('Failed to decode token:', err)
                logout()
            }
        }
    }, [])

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                const exp = payload.exp
                const now = Math.floor(Date.now() / 1000)
                if (exp && now < exp) {
                    const timeout = (exp - now) * 1000
                    timer = setTimeout(() => {
                        console.warn('Token expired (by timeout). Logging out.')
                        logout()
                    }, timeout)
                }
            } catch {
                logout()
            }
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [token])

    useEffect(() => {
        if (justLoggedOut) {
            navigate('/') // navigate to /home
            setJustLoggedOut(false) // clear the justLoggedOut flag
        }
    }, [justLoggedOut, navigate])

    useEffect(() => {
        if (name) {
            localStorage.setItem('username', name) // 存储到 localStorage
        } else {
            localStorage.removeItem('username') // 清除存储
            setCurrentForm('login') // name 为空时，切换到 login
        }
    }, [name])

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
                justLoggedOut,
                setJustLoggedOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook for accessing AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
