import React from 'react';
import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "../../app/context/ThemeContext";
import { darkTheme, lightTheme } from "./theme";
import Header from "./Header";
import { MessageProvider } from '../../app/context/MessageContext';

function App() {
  const { isDarkMode } = useTheme();

  return (
    <MessageProvider>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <ToastContainer position='bottom-right' hideProgressBar theme="colored" />
        <CssBaseline />
        <Header />
        <Outlet /> {/* This is a placeholder for the child components */}
      </ThemeProvider>
    </MessageProvider>
  );
}

export default App;
