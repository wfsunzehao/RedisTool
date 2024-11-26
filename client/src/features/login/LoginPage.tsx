// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { useAuth } from '../../app/context/AuthContext';
 // 引入 AuthContext

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [targetUsername, setTargetUsername] = useState('');

  const { setIsLoggedIn, setToken } = useAuth();  // 从 AuthContext 中获取方法
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://localhost:7179/api/Auth/login', {
        username,
        password
      });

      // 登录成功后保存 token，并更新登录状态
      localStorage.setItem('authToken', response.data.token);
      setToken(response.data.token);  // 更新状态中的 token
      setIsLoggedIn(true);  // 更新登录状态
      //alert('Login successful!');
      navigate('/');  // 登录成功后跳转到主页
    } catch (error) {
      setError('Invalid username or password.');
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://localhost:7179/api/Auth/register', {
        username,
        password,
        email
      });

      alert('Registration successful! You can now log in.');
      setIsLogin(true);
    } catch (error) {
      setError('Registration failed. Please check your details.');
    }
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to change your password.');
      return;
    }

    try {
      const response = await axios.post(
        'https://localhost:7179/api/Auth/change-password',
        { oldPassword, newPassword, targetUsername },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Password changed successfully!');
      setIsChangePassword(false);
    } catch (error) {
      setError('Failed to change password. Please check your old password.');
    }
  };

  return (
    <Dialog open={true} onClose={() => {}} fullWidth maxWidth="sm">
      <DialogTitle>{isChangePassword ? 'Change Password' : isLogin ? 'Login' : 'Register'}</DialogTitle>
      <DialogContent>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        {isChangePassword ? (
          <form onSubmit={handleChangePassword}>
            <TextField
              label="Username"
              value={targetUsername || username}
              disabled={!isAdmin}
              onChange={(e) => setTargetUsername(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <DialogActions>
              <Button type="submit" color="primary">Change Password</Button>
              <Button onClick={() => setIsChangePassword(false)} color="secondary">Back to Login</Button>
            </DialogActions>
          </form>
        ) : (
          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            {isLogin ? null : (
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required={!isLogin}
              />
            )}
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <DialogActions>
              <Button type="submit" color="primary">{isLogin ? 'Login' : 'Register'}</Button>
            </DialogActions>
          </form>
        )}
      </DialogContent>

      <DialogActions>
        {isLogin ? (
          <>
            <Button onClick={() => setIsLogin(false)} color="secondary">Register here</Button>
            <Button onClick={() => setIsChangePassword(true)} color="primary">Change Password</Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsLogin(true)} color="secondary">Login here</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LoginPage;
