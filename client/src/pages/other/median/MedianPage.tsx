import React, { useState } from 'react'
import { Box, Button, Typography, TextField } from '@mui/material'
import swal from 'sweetalert'
import { Overlay } from '../../../common/constants/constants'
import LoadingComponent from '../../../common/components/CustomLoading'

const MedianPage: React.FC = () => {
    const [folderPath, setFolderPath] = useState<string>('D:\\Tests\\Alt\\Latency') // Default path
    const [loading, setLoading] = useState<boolean>(false)

    // Handle changes in the folder path input field
    const handleFolderPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFolderPath(event.target.value)
    }

    // Submit the form
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()

        if (!folderPath) {
            swal('Error!', 'Path cannot be empty', 'error')
            return
        }

        swal({
            title: 'Confirm Action',
            text: 'Do you want to start processing this folder?',
            buttons: ['Cancel', 'Confirm'],
            dangerMode: true,
        }).then((willSubmit) => {
            if (willSubmit) {
                setLoading(true)

                // Send the folder path to the backend using fetch to get the Excel file
                fetch('https://localhost:7179/api/Median/sendMedianJson', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ path: folderPath }),
                })
                    .then((response) => {
                        if (response.ok) {
                            // The response contains the Excel file content
                            return response.blob()
                        } else {
                            throw new Error('Unable to generate report')
                        }
                    })
                    .then((blob) => {
                        // Create a Blob URL
                        const downloadUrl = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = downloadUrl
                        link.download = 'Median_Report.xlsx' // Set the download file name
                        link.click() // Trigger the download
                        swal('Success!', 'Folder processed successfully! Excel report has been downloaded!', 'success')
                    })
                    .catch((error) => {
                        console.error(error)
                        swal('Error!', 'An error occurred while processing the folder', 'error')
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            }
        })
    }

    return (
        <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography
                variant="h3"
                gutterBottom
                sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #1976d2, #9c27b0)', // Example gradient
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '30px', // You can adjust the font size as needed
                }}
            >
                Enter the folder path
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <TextField
                        value={folderPath}
                        onChange={handleFolderPathChange} // User modifies the path
                        variant="outlined"
                        label="Folder Path"
                        fullWidth
                        sx={{ flexGrow: 1 }}
                    />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{ mx: 1, textTransform: 'none' }}
                    >
                        Submit
                    </Button>
                </Box>
            </form>
            {loading && (
                <Overlay>
                    <LoadingComponent message="Processing, please wait..." />
                </Overlay>
            )}
        </Box>
    )
}

export default MedianPage
