import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface CustomSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: React.ReactNode ; // 接收消息内容
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({ open, onClose, message }) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={10000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // 位置
      sx={{ marginTop: '60px',border: '1px solid #eaeaea' }} // 设置顶部间距
    >
      <Alert
        onClose={onClose}
        severity="success"
        sx={{
          
          fontSize: '1rem', // 字体大小
          width: '340px', // 设置宽度
        }}
      >
        {message} {/* 使用传入的消息 */}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
