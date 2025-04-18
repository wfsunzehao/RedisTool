import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'

const AdminInfoPanel: React.FC = () => {
    const theme = useTheme()

    return (
        <Box
            sx={{
                width: 300,
                padding: 3,
                backgroundColor: 'rgba(255, 255, 255, 0)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                color: theme.palette.text.primary,
                boxShadow: theme.shadows[6],
                position: 'absolute',
                right: 0,
                transform: 'translateY(-50%)',
                opacity: 1,
                transition: 'transform 0.3s ease, opacity 0.3s ease',
            }}
        >
            <Typography variant="h6" gutterBottom>
                Admin
            </Typography>
            <Typography variant="body1">📧: frankzhoua@wicresoft.com</Typography>
        </Box>
    )
}

export default AdminInfoPanel
