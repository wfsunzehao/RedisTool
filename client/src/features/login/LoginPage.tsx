// src/components/LoginPage.tsx
import React, { useState } from 'react';
import { getAccessToken, sendTokenToBackend } from '../../app/services/authService';

const LoginPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    try {
      // 获取 token
      const accessToken = await getAccessToken();

      // 将 token 发送到后端
      //await sendTokenToBackend(accessToken);
      console.log(accessToken);

      // 登录成功后更新状态
      //setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <h1>Login with Azure AD</h1>
      {!isLoggedIn ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <p>Logged in successfully!</p>
      )}
    </div>
  );
};

export default LoginPage;
