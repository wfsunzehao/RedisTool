import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // 导入 useNavigate

const AuthPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLogin, setIsLogin] = useState(true);  // 控制是否显示登录表单

    const navigate = useNavigate();  // 获取 navigate 函数

    // 处理登录请求
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post('https://localhost:7179/api/Auth/login', {
                username,
                password
            });

            localStorage.setItem('authToken', response.data.token);  // 保存 JWT
            alert('Login successful!');
            
            // 登录成功后跳转到主页
            navigate('/home');  // 根据你的路由配置来决定跳转的路径
        } catch (error) {
            setError('Invalid username or password.');
        }
    };

    // 处理注册请求
    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post('https://localhost:7179/api/Auth/register', {
                username,
                password,
                email
            });

            alert('Registration successful! You can now log in.');
            setIsLogin(true);  // 注册成功后切换回登录界面
        } catch (error) {
            setError('Registration failed. Please check your details.');
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {/* 根据 isLogin 显示登录或注册表单 */}
            <form onSubmit={isLogin ? handleLogin : handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {isLogin ? null : (
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                )}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>

            <div>
                {isLogin ? (
                    <p>
                        Don't have an account?{' '}
                        <button onClick={() => setIsLogin(false)}>Register here</button>
                    </p>
                ) : (
                    <p>
                        Already have an account?{' '}
                        <button onClick={() => setIsLogin(true)}>Login here</button>
                    </p>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
