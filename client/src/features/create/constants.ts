import { createTheme } from "@mui/material";
import { Button, keyframes, ListItem, ListItemText, Paper, styled } from "@mui/material";



//订阅列表
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

 const slideInAnimation = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

// 创建点击动画
const clickAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
`;


export const StyledPaper = styled(Paper)`
  padding: 20px;
  border-radius: 10px;
  transition: background-color 0.3s;
  animation: ${slideInAnimation} 0.5s ease-in-out;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

export const StyledListItem = styled(ListItem)`
  transition: background-color 0.3s;
  &:hover {
    background-color: #e0f7fa;
  }
  &:active {
    animation: ${clickAnimation} 0.2s ease-in-out;
  }
`;

export const StyledListItemText = styled(ListItemText)`
  text-align: left;
`;

export const StyledButton = styled(Button)`
  transition: background-color 0.3s;
  &:hover {
    background-color: #1565c0;
  }
  &:active {
    animation: ${clickAnimation} 0.2s ease-in-out;
  }
`;