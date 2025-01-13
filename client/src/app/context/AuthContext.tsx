import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'

// Define the type for AuthContext
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

// AuthProvider component that provides all authentication-related state
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'))
    const [currentForm, setCurrentForm] = useState<'login' | 'signup' | 'forgotPassword'>('login')
    const [role, setRole] = useState<'admin' | 'user'>('user') // Default role is a regular user
    const [name, setName] = useState<string>('') // Manage the username

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true) // If a token exists, set to logged in
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

// Custom hook for accessing AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
