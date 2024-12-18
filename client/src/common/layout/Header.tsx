import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  List,
  ListItem,
  Badge,
  Avatar,
  Popover,
  Divider,
  Typography,
  MenuItem,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import { useTheme } from "../../app/context/ThemeContext";
import logo from "../../../public/images/wicrecend3.png";
import { useMessage } from "../../app/context/MessageContext";
import { useAuth } from "../../app/context/AuthContext";
import { Switch } from "@nextui-org/react";
import { SunIcon } from "../icon/SunIcon";
import { MoonIcon } from "../icon/MoonIcon";
import { loginTextStyles, user } from "../constants/constants";

const midLinks = [
  { title: "Tests", path: "/create" },
  { title: "Actions", path: "/delete" },
  { title: "Tools", path: "/more" },
];

const navStyles = {
  color: "inherit",
  textDecoration: "none",
  typography: "h6",
  marginRight: "20px",
  "&:hover": {
    textDecoration: "underline",
  },
  "&.active": {
    fontWeight: "bold",
  },
};

export default function Header() {
  const { toggleTheme, isDarkMode } = useTheme();
  const { messages } = useMessage();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [logoutAnchorEl, setLogoutAnchorEl] = useState<HTMLElement | null>(null);

  const handleChatIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setLogoutAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setLogoutAnchorEl(null);
    navigate('/');
  };

  const open = Boolean(anchorEl);
  const id = open ? "message-popover" : undefined;

  const openLogoutMenu = Boolean(logoutAnchorEl);
  const logoutId = openLogoutMenu ? "logout-popover" : undefined;

  return (
    <AppBar position="sticky" 
            sx={{ 
                  boxShadow: 2 ,
                  backgroundColor: isDarkMode ? "#333333" : "#1976d2", // 深色模式使用深蓝色，浅色模式使用浅蓝色
                  color: "#ffffff", // 文字颜色始终为白色，以确保在蓝色背景上清晰可见
                  paddingLeft: "40px", // 左侧留空
                  paddingRight: "40px", // 右侧留空
                }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
        {/* 左侧 Logo 和主题切换 */}
        <Box display="flex" alignItems="center">
          <NavLink to="/" style={{ display: "flex", alignItems: "center" }}>
            <img
              src={logo}
              alt="Logo"
              style={{
                maxHeight: 40,
                objectFit: "contain",
                filter: "invert(100%) sepia(100%) saturate(0%) hue-rotate(180deg)",
              }}
            />
          </NavLink>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            size="lg"
            thumbIcon={({ isSelected }) =>
              isSelected ? <SunIcon style={{ fontSize: "20px" }} /> : <MoonIcon style={{ fontSize: "20px" }} />
            }
          />
        </Box>

        {/* 中间导航链接，仅在用户登录时显示 */}
        {isLoggedIn && (
          <List sx={{ display: "flex", padding: 0 }}>
            {midLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                {title}
              </ListItem>
            ))}
          </List>
        )}

        {/* 右侧消息和用户头像 */}
        {/* 右侧部分：用户控制区域 */}
        <Box display="flex" alignItems="center">
          {/* 消息图标 - 仅登录状态下显示 */}
          {isLoggedIn && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
              onClick={handleChatIconClick}
            >
              <Badge badgeContent={messages.length} color="secondary">
                <ChatIcon />
              </Badge>
            </IconButton>
          )}
          {/* 消息弹窗 */}
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Box sx={{ width: "300px" }}>
              {/* 如果有消息，则显示消息列表 */}
              {messages.length > 0 ? (
                <List>
                  {messages.map(({ text, timestamp }, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <Typography variant="body2">{text}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(timestamp).toLocaleString()}
                        </Typography>
                      </ListItem>
                      {index < messages.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                // 没有消息时显示提示
                <Typography variant="body1" align="center" sx={{ padding: 2 }}>
                  No messages
                </Typography>
              )}
            </Box>
          </Popover>

          {/* 用户头像或登录提示 */}
          {isLoggedIn ? (
            <Box display="flex" alignItems="center" sx={{ marginLeft: 2 }}>
            {/* 用户名和头像的容器 */}
            <Box display="flex" alignItems="center">
              {/* 用户名部分 */}
              <Typography 
                variant="body2" 
                sx={{
                  fontWeight: "500",  // 改为适中的字体粗细
                  fontSize: "16px",  // 增大字体
                  color:  "#ffffff",  // 根据主题调整字体颜色
                  marginRight: "10px", // 头像与用户名之间的间距
                }}
              >
                {user.username}
              </Typography>
              
              {/* 头像部分 */}
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  cursor: "pointer",
                  borderRadius: "50%",  // 确保头像是圆形的
                  border: "2px solid",  // 给头像加个边框
                  borderColor: isDarkMode ? "#ffffff" : "#1976d2",  // 根据主题调整边框颜色
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",  // 添加过渡效果
                  "&:hover": {
                    transform: "scale(1.1)",  // 悬停时放大头像
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",  // 悬停时添加阴影
                  },
                }}
                src={user.avatar}
                alt="User Avatar"
                onClick={handleAvatarClick}
              />
            </Box>
          </Box>
          
          ) : (
            <Typography variant="body2" sx={loginTextStyles}>
              Please log in
            </Typography>
          )}
          {/* 登出弹窗 */}
          <Popover
            id={logoutId}
            open={openLogoutMenu}
            anchorEl={logoutAnchorEl}
            onClose={() => setLogoutAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Popover>
        </Box>

      </Toolbar>
    </AppBar>
  );
}
