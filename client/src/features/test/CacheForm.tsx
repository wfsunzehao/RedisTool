import React, { useState } from 'react';
import { Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const CacheForm: React.FC = () => {
  const [data, setData] = useState({ subscription: '', group: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [suppressPrompt, setSuppressPrompt] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (suppressPrompt) {
      // 直接提交表单
      console.log('提交数据:', data);
      return;
    }
    setOpenDialog(true);
  };

  const handleConfirm = (confirm: boolean) => {
    setOpenDialog(false);
    if (confirm) {
      console.log('提交数据:', data);
    }
  };

  const handleSuppressPromptChange = () => {
    setSuppressPrompt(!suppressPrompt);
  };

  return (
    <div>
      <Typography variant="h4">新建缓存</Typography>
      <TextField
        label="订阅"
        name="subscription"
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="组"
        name="group"
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        提交
      </Button>
      <Button variant="outlined" color="secondary" style={{ marginLeft: '10px' }} onClick={() => setData({ subscription: '', group: '' })}>
        取消
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>确认提交</DialogTitle>
        <DialogContent>
          <DialogContentText>
            您确定要提交这些信息吗？
          </DialogContentText>
          <TextField
            type="checkbox"
            checked={suppressPrompt}
            onChange={handleSuppressPromptChange}
            label="今日不再提示"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirm(false)} color="primary">取消</Button>
          <Button onClick={() => handleConfirm(true)} color="primary">确认</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CacheForm;