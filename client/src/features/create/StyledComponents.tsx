import { Button, keyframes, ListItem, ListItemText, Paper, styled } from "@mui/material";


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