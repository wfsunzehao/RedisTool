import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
  Paper,
  ThemeProvider,
  createTheme,
  styled,
  keyframes,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { AddCircleOutline, CheckCircleOutline } from '@mui/icons-material';

// 创建主题
const theme = createTheme({
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
});

// 创建点击动画
const clickAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
`;

// 创建切换页面动画
const slideInAnimation = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

// 美化后的组件
const StyledPaper = styled(Paper)`
  padding: 20px;
  border-radius: 10px;
  transition: background-color 0.3s;
  animation: ${slideInAnimation} 0.5s ease-in-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const StyledListItem = styled(ListItem)`
  transition: background-color 0.3s;
  &:hover {
    background-color: #e0f7fa;
  }
  &:active {
    animation: ${clickAnimation} 0.2s ease-in-out;
  }
`;

const StyledListItemText = styled(ListItemText)`
  text-align: left;
`;

const StyledButton = styled(Button)`
  transition: background-color 0.3s;
  &:hover {
    background-color: #1565c0;
  }
  &:active {
    animation: ${clickAnimation} 0.2s ease-in-out;
  }
`;

const CreatePage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const [subscription, setSubscription] = useState('');
  const [group, setGroup] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [nextTimeDontPrompt, setNextTimeDontPrompt] = useState('no'); // 使用单选框

  const handleSelectItem = (item: string) => {
    setSelectedItem(item);
  };

  const handleSubmit = () => {
    if (nextTimeDontPrompt === 'yes') {
      handleConfirm();
    } else {
      setOpenDialog(true);
    }
  };

  const handleConfirm = () => {
    setOpenSnackbar(true);
    setOpenDialog(false);
    resetFields();
  };

  const resetFields = () => {
    setSelectedItem('');
    setSubscription('');
    setGroup('');
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" padding={2} height="100vh">
        <StyledPaper elevation={3} style={{ width: 240, marginRight: 20 }}>
          <Typography variant="h6" gutterBottom align="center">选择项</Typography>
          <List>
            {['BVT', 'MAN', 'PERF'].map((item) => (
              <StyledListItem
                button
                key={item}
                onClick={() => handleSelectItem(item)}
                selected={selectedItem === item}
              >
                <StyledListItemText primary={<Typography variant="body1">{item}</Typography>} />
              </StyledListItem>
            ))}
          </List>
        </StyledPaper>

        <StyledPaper elevation={3} style={{ flex: 1 }}>
          {selectedItem && (
            <Box>
              <Typography variant="h5" gutterBottom>提交信息: <span style={{ color: '#1976d2' }}>{selectedItem}</span></Typography>
              <TextField
                label="订阅"
                value={subscription}
                onChange={(e) => setSubscription(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ style: { color: '#555' } }}
                inputProps={{ style: { color: '#333' } }}
              />
              <TextField
                label="组"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ style: { color: '#555' } }}
                inputProps={{ style: { color: '#333' } }}
              />
              <Box marginTop={2} display="flex" justifyContent="center">
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  style={{ marginRight: 10 }}
                >
                  提交
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  onClick={resetFields}
                >
                  取消
                </StyledButton>
              </Box>
            </Box>
          )}
        </StyledPaper>

        {/* 提交确认对话框 */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>确认提交</DialogTitle>
          <DialogContent>
            <DialogContentText>
              确认提交吗？是否下次不再提示？
            </DialogContentText>
            <RadioGroup
              value={nextTimeDontPrompt}
              onChange={(e) => setNextTimeDontPrompt(e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="下次不提示" />
              <FormControlLabel value="no" control={<Radio />} label="继续提示" />
            </RadioGroup>
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center' }}>
            <Button onClick={() => setOpenDialog(false)} color="primary" startIcon={<CheckCircleOutline />}>
              取消
            </Button>
            <Button onClick={handleConfirm} color="primary" startIcon={<CheckCircleOutline />}>
              确认
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          message={`提交成功: ${selectedItem} | 订阅: ${subscription} | 组: ${group}`}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // 设置提示框位置为右下角
        />
      </Box>
    </ThemeProvider>
  );
};

export default CreatePage;
