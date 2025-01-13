import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { DialogContentText, Link } from '@mui/material'

interface CustomDiaProps {
    open: boolean
    onClose: () => void
    message: React.ReactNode // Receive message content
}

const CustomDia: React.FC<CustomDiaProps> = ({ open, onClose, message }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            sx={{ backdropFilter: 'blur(4px)', borderRadius: '10px' }} // Add background blur effect and rounded corners
        >
            <DialogContent sx={{ padding: 3 }}>
                <Alert
                    severity="success"
                    sx={{
                        fontSize: '1rem', // Font size
                        width: '100%', // Set width
                        borderRadius: '8px', // Rounded corners
                        mb: 2, // Bottom margin
                    }}
                >
                    {message} {/* Use the passed message */}
                </Alert>
                <DialogContentText sx={{ textAlign: 'left', fontSize: '1.2rem', lineHeight: 1.5 }}>
                    Please visit{' '}
                    <Link href="https://portal.azure.com" target="_blank" rel="noopener" color="primary">
                        Azure Portal
                    </Link>{' '}
                    for more details
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', padding: 2 }}>
                <Button
                    onClick={onClose}
                    color="primary"
                    variant="contained"
                    sx={{ fontSize: '1.2rem', padding: '8px 16px' }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CustomDia
