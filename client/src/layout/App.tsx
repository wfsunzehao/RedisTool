import React from 'react'; 
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "../app/context/ThemeContext";
import { darkTheme, lightTheme } from "./theme";
import Header from "./Header";
import { MessageProvider } from '../app/context/MessageContext';
import { SignalProvider } from '../app/context/SignalContext';
import { AuthProvider } from "../app/context/AuthContext"; // 引入 AuthProvider
import { AuthStateProvider } from '../app/context/AuthStateContext';


function App() {
  const { isDarkMode } = useTheme();

  return (
    <AuthProvider> {/* 将 AuthProvider 包裹在其他 provider 上面 */}
      <AuthStateProvider>
        <SignalProvider>
          <MessageProvider>
            <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
              <ToastContainer position='bottom-right' hideProgressBar theme="colored" />
              <CssBaseline />
              <Header />
              <Outlet /> {/* This is a placeholder for the child components */}
            </ThemeProvider>
          </MessageProvider>
        </SignalProvider>
        
      </AuthStateProvider>
      
    </AuthProvider>
  );
}

export default App;
