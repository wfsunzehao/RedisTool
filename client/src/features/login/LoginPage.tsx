import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { useAuth } from '../../app/context/AuthContext';

interface LoginPageProps {
  onClose: () => void; // 关闭对话框的函数
}

const LoginPage: React.FC<LoginPageProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');  // 新增：用于修改密码时输入旧密码
  const [newPassword, setNewPassword] = useState('');  // 新增：用于修改密码时输入新密码
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');  // 新增：用于显示修改密码成功的消息
  const [isLogin, setIsLogin] = useState(true); // 默认是登录模式
  const [isChangePassword, setIsChangePassword] = useState(false); // 新增：判断是否显示修改密码界面
  const [isRegister, setIsRegister] = useState(false); // 新增：判断是否显示注册界面

  const { setIsLoggedIn, setToken } = useAuth();

  // 登录逻辑
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://localhost:7179/api/Auth/login', {
        username,
        password,
      });

      localStorage.setItem('authToken', response.data.token);
      setToken(response.data.token);
      setIsLoggedIn(true);
      onClose(); // 登录成功后关闭对话框
    } catch (error) {
      setError('Invalid username or password.');
    }
  };

  // 注册逻辑
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://localhost:7179/api/Auth/register', {
        username,
        password,
        email
      });

      alert('Registration successful! You can now log in.');
      setIsLogin(true); // 注册成功后切换回登录模式
      setIsRegister(false); // 关闭注册模式
    } catch (error) {
      setError('Registration failed. Please check your details.');
    }
  };

  // 修改密码逻辑
  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://localhost:7179/api/Auth/change-password', {
        username,
        oldPassword,
        newPassword
      });

      setSuccess('Password changed successfully.');
      setError('');
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      setError('Failed to change password. Please check your details.');
      setSuccess('');
    }
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isLogin ? 'Login' : isChangePassword ? 'Change Password' : isRegister ? 'Register' : ''}</DialogTitle>
      <DialogContent>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

        <form onSubmit={isLogin ? handleLogin : isChangePassword ? handleChangePassword : handleRegister}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          {!isLogin && !isChangePassword && (
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required={!isLogin}
            />
          )}

          {/* 只有在登录或注册时显示密码框 */}
          {!isChangePassword && (
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          )}

          {/* 在修改密码模式下显示旧密码和新密码框 */}
          {isChangePassword && (
            <>
              <TextField
                label="Old Password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </>
          )}
          
          <DialogActions>
            <Button type="submit" color="primary">
              {isLogin ? 'Login' : isChangePassword ? 'Change Password' : 'Register'}
            </Button>
            <Button onClick={onClose} color="secondary">Cancel</Button>
          </DialogActions>
        </form>
      </DialogContent>

      <DialogActions>
        {isLogin ? (
          <>
            <Button onClick={() => { setIsLogin(false); setIsRegister(true); }} color="secondary">Register here</Button>
            <Button onClick={() => { setIsLogin(false); setIsChangePassword(true); }} color="primary">Forgot Password</Button>
          </>
        ) : isChangePassword ? (
          <Button onClick={() => { setIsLogin(true); setIsChangePassword(false); }} color="secondary">Back to Login</Button>
        ) : (
          <Button onClick={() => { setIsLogin(true); setIsRegister(false); }} color="secondary">Login here</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LoginPage;
