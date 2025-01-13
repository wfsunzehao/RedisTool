import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

interface CustomSnackbarProps {
    open: boolean
    onClose: () => void
    message: React.ReactNode // Receive message content
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({ open, onClose, message }) => {
    return (
        <Snackbar
            open={open}
            onClose={onClose}
            autoHideDuration={10000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position
            sx={{ marginTop: '60px', border: '1px solid #eaeaea' }} // Set top margin
        >
            <Alert
                onClose={onClose}
                severity="success"
                sx={{
                    fontSize: '1rem', // Font size
                    width: '340px', // Set width
                }}
            >
                {message} {/* Use the passed message */}
            </Alert>
        </Snackbar>
    )
}

export default CustomSnackbar
