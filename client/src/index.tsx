import './assets/styles/main.css'
import './assets/styles/output.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { router } from './app/router/Routes.tsx';
import { ThemeProvider } from './app/context/ThemeContext.tsx';
import { NextUIProvider } from '@nextui-org/react';





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NextUIProvider>
      <ThemeProvider >
        <RouterProvider router={router}/>
      </ThemeProvider>   
    </NextUIProvider>
    
  </StrictMode>
)
