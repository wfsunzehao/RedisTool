import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/context/AuthContext'

const ProtectedRoute = () => {
    const { isLoggedIn } = useAuth()
    const location = useLocation()

    if (!isLoggedIn) {
        return <Navigate to="/" state={{ from: location }} replace />
    }

    return <Outlet />
}

export default ProtectedRoute
