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
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true); // 默认是登录模式

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
    } catch (error) {
      setError('Registration failed. Please check your details.');
    }
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isLogin ? 'Login' : 'Register'}</DialogTitle>
      <DialogContent>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          {!isLogin && (
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
            <Button onClick={onClose} color="secondary">Cancel</Button>
          </DialogActions>
        </form>
      </DialogContent>

      <DialogActions>
        {isLogin ? (
          <>
            <Button onClick={() => setIsLogin(false)} color="secondary">Register here</Button>
            <Button onClick={() => alert('Forgot password clicked')} color="primary">Forgot Password</Button>
          </>
        ) : (
          <Button onClick={() => setIsLogin(true)} color="secondary">Login here</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LoginPage;
