import React from 'react'
import { Backdrop, Box, CircularProgress, Typography } from '@mui/material'
import defaultImageUrl from '@/assets/images/loadingwic.png'

interface Props {
    message?: string
    imageUrl?: string // Optional image URL
}

export default function LoadingComponent({ message, imageUrl }: Props) {
    return (
        <Backdrop
            open={true}
            sx={{
                backdropFilter: 'blur(1px)', // Background blur
                backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust background color and opacity
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {/* Image */}
                {imageUrl || defaultImageUrl ? (
                    <Box
                        component="img"
                        src={imageUrl || defaultImageUrl}
                        alt="Loading"
                        sx={{
                            width: '600px', // Increase image width
                            height: '500px', // Increase image height
                            marginBottom: 3, // Increase spacing between image and text
                            borderRadius: '50%', // Make the image circular
                        }}
                    />
                ) : null}
                <CircularProgress size={50} sx={{ color: 'white', marginBottom: 3 }} />
                <Typography variant="h5" sx={{ mt: 4, color: 'black' }}>
                    {message}
                </Typography>
            </Box>
        </Backdrop>
    )
}
