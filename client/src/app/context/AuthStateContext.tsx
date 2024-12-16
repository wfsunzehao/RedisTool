import React, { createContext, useContext, useState, ReactNode } from 'react';

// 定义上下文的类型
interface AuthStateContextType {
  currentForm: 'login' | 'signup' | 'forgotPassword';
  setCurrentForm: React.Dispatch<React.SetStateAction<'login' | 'signup' | 'forgotPassword'>>;
}

// 创建上下文
const AuthStateContext = createContext<AuthStateContextType | undefined>(undefined);

// AuthProvider 组件，提供状态
export const AuthStateProvider = ({ children }: { children: ReactNode }) => {
  const [currentForm, setCurrentForm] = useState<'login' | 'signup' | 'forgotPassword'>('login');

  return (
    <AuthStateContext.Provider value={{ currentForm, setCurrentForm }}>
      {children}
    </AuthStateContext.Provider>
  );
};

// 自定义 hook 用于访问 AuthStateContext
export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error('useAuthState must be used within an AuthStateProvider');
  }
  return context;
};
