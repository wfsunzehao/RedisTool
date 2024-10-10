import { createTheme } from "@mui/material";

// 创建主题
export const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#ff4081',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h5: {
        fontWeight: 700,
        color: '#2c3e50',
      },
      h6: {
        fontWeight: 600,
        color: '#34495e',
      },
      body1: {
        fontWeight: 400,
        color: '#555',
      },
    },
  });

 export const subscriptionList = [
    {
      value: '1e57c478-0901-4c02-8d35-49db234b78d2',
      label: 'Cache Team - Vendor CTI Testing 2',
    },
    {
      value: '32353108-c7dc-4873-9ce8-a7d4d731673d',
      label: 'CacheTeam - RedisTiP',
    },
  ];