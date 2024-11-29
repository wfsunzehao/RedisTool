import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, CircularProgress } from '@mui/material';
import { useAuth } from '../../app/context/AuthContext';
import agent from '../../app/api/agent';

interface LoginPageProps {
  onClose: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setIsLoggedIn, setToken } = useAuth();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await agent.Auth.login(username, password);
      localStorage.setItem('authToken', response.token);
      setToken(response.token);
      setIsLoggedIn(true);
      setSuccess('Login successful!');
      onClose();
    } catch (error) {
      const errorMessage = (error as  { data: { message: string }  })?.data?.message || 'Invalid username or password.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await agent.Auth.register(username, password, email);
      setSuccess(response.message);
      setIsLogin(true);
      setIsRegister(false);
    } catch (error) {
      const errorMessage = (error as  { data: { message: string }  })?.data?.message || 'Failed to register. Please check your details.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await agent.Auth.changePassword(username, oldPassword, newPassword);
      setSuccess('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      const errorMessage = (error as  { data: { message: string }  })?.data?.message || 'Failed to change password. Please check your details.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
            <Button type="submit" color="primary" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : isLogin ? 'Login' : isChangePassword ? 'Change Password' : 'Register'}
            </Button>
            <Button onClick={onClose} color="secondary" disabled={isLoading}>Cancel</Button>
          </DialogActions>
        </form>
      </DialogContent>

      <DialogActions>
        {isLogin ? (
          <>
            <Button onClick={() => { setIsLogin(false); setIsRegister(true); }} color="secondary" disabled={isLoading}>Register here</Button>
            <Button onClick={() => { setIsLogin(false); setIsChangePassword(true); }} color="primary" disabled={isLoading}>Change Password</Button>
          </>
        ) : isChangePassword ? (
          <Button onClick={() => { setIsLogin(true); setIsChangePassword(false); }} color="secondary" disabled={isLoading}>Back to Login</Button>
        ) : (
          <Button onClick={() => { setIsLogin(true); setIsRegister(false); }} color="secondary" disabled={isLoading}>Login here</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LoginPage;
