import React from 'react';
import { Box, TextField, Button, Typography, Link, useTheme } from '@mui/material';

const LoginForm: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 400,
        padding: 3,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: theme.shadows[3],
        color: theme.palette.text.primary,
        transition: 'background-color 0.3s ease, color 0.3s ease, border 0.3s ease',
        border: `1px solid ${
          theme.palette.mode === 'dark' ? theme.palette.grey[700] : 'transparent'
        }`,
      }}
    >
      {/* 标题部分 */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Sign in
      </Typography>

      {/* 辅助文字部分 */}
      <Typography
        variant="body2"
        gutterBottom
        sx={{
          textAlign: 'center',
          color: theme.palette.text.secondary,
        }}
      >
        Don't have an account?{' '}
        <Link
          href="#"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
              color: theme.palette.primary.dark,
            },
          }}
        >
          Sign up
        </Link>
      </Typography>

      {/* 输入框部分 */}
      <TextField
        fullWidth
        label="Email address"
        margin="normal"
        type="email"
        variant="outlined"
        InputProps={{
          style: { color: theme.palette.text.primary },
        }}
        InputLabelProps={{
          style: { color: theme.palette.text.secondary },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.palette.grey[400],
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.dark,
            },
          },
        }}
      />
      <TextField
        fullWidth
        label="Password"
        margin="normal"
        type="password"
        variant="outlined"
        InputProps={{
          style: { color: theme.palette.text.primary },
        }}
        InputLabelProps={{
          style: { color: theme.palette.text.secondary },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.palette.grey[400],
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.dark,
            },
          },
        }}
      />

      {/* 忘记密码链接 */}
      <Link
        href="#"
        variant="body2"
        sx={{
          display: 'block',
          marginBottom: 2,
          textAlign: 'right',
          color: theme.palette.text.secondary,
          '&:hover': {
            textDecoration: 'underline',
            color: theme.palette.primary.main,
          },
        }}
      >
        Forgot password?
      </Link>

      {/* 按钮部分 */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontWeight: 'bold',
          textTransform: 'none',
          fontSize: '1rem',
          padding: '10px',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        Sign in
      </Button>

      {/* 底部说明文字 */}
      <Typography
        variant="body2"
        sx={{
          marginTop: 2,
          color: theme.palette.text.secondary,
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        Enter <strong>email</strong> and <strong>password </strong>
      </Typography>
    </Box>
  );
};

export default LoginForm;
