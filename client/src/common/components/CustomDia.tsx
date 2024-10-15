import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { DialogContentText, Link } from '@mui/material';

interface CustomDiaProps {
  open: boolean;
  onClose: () => void;
  message: React.ReactNode; // 接收消息内容
}

const CustomDia: React.FC<CustomDiaProps> = ({ open, onClose, message }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{ backdropFilter: 'blur(4px)', borderRadius: '10px' }} // 添加背景模糊效果和圆角
    >
      <DialogContent sx={{ padding: 3 }}>
        <Alert
          severity="success"
          sx={{
            fontSize: '1rem', // 字体大小
            width: '100%', // 设置宽度
            borderRadius: '8px', // 圆角
            mb: 2, // 下边距
          }}
        >
          {message} {/* 使用传入的消息 */}
        </Alert>
        <DialogContentText sx={{ textAlign: 'left', fontSize: '1.2rem', lineHeight: 1.5 }}>
          请前往 <Link href="https://portal.azure.com" target="_blank" rel="noopener" color="primary">Azure Portal</Link> 查看
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', padding: 2 }}>
        <Button onClick={onClose} color="primary" variant="contained" sx={{ fontSize: '1.2rem', padding: '8px 16px' }}>
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDia;
