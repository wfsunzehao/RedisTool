import React from 'react';
import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';

interface Props {
  message?: string;
  imageUrl?: string; // 可选的图片 URL
}

export default function LoadingComponent({ message, imageUrl }: Props) {
  const defaultImageUrl = '../../../public/images/loadingwic.png';

  return (
    <Backdrop
      open={true}
      sx={{
        backdropFilter: 'blur(1px)', // 背景模糊
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // 调整背景颜色和透明度
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
        {/* 图片 */}
        {imageUrl || defaultImageUrl ? (
          <Box
            component="img"
            src={imageUrl || defaultImageUrl}
            alt="Loading"
            sx={{
              width: '600px', // 增加图片的宽度
              height: '500px', // 增加图片的高度
              marginBottom: 3, // 增加图片和文本之间的间距
              borderRadius: '50%', // 使图片变成圆形
            }}
          />
        ) : null}
        <CircularProgress size={50}  sx={{ color:"white",marginBottom: 3 }} />
        <Typography variant="h5" sx={{ mt: 4, color: 'black' }}>
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
}
