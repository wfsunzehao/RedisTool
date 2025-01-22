import { createTheme } from '@mui/material'

export const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#ff4081',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
            fontWeight: 700,
            color: '#2c3e50',
        },
        h6: {
            fontWeight: 600,
            color: '#34495e',
        },
        body1: {
            fontWeight: 400,
            color: '#555',
        },
    },
})
