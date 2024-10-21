import React from 'react';
import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';

interface Props {
  message?: string;
  imageUrl?: string; // 可选的图片 URL
}

export default function LoadingComponent({ message = 'Loading...', imageUrl }: Props) {
  imageUrl='../../../public/images/wic4.png';
  return (
    <Backdrop open={true} invisible={true}>
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

          {/* 图片 */}
          {imageUrl && (
            <Box
              component="img"
              src={imageUrl}
              alt="Loading"
              sx={{
                width: '120px', // 增加图片的宽度
                height: '120px', // 增加图片的高度
                marginBottom: 3, // 增加图片和文本之间的间距
                borderRadius: '50%', // 使图片变成圆形
              }}
            />
          )}
          <CircularProgress size={60} color="primary" sx={{ marginBottom: 3 }} />
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
            {message}
          </Typography>
        </Box>
    </Backdrop>
  );
}
