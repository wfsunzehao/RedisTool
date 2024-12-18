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
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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

// 新增：获取头部样式的逻辑
const getHeaderStyles = (isHomePage: boolean, isDarkMode: boolean) => {
  return {
    backgroundColor: isHomePage
      ? isDarkMode
        ? "#333333" // 主页且黑暗模式
        : "#1976d2" // 主页且亮色模式
      : isDarkMode
      ? "#333333" // 非主页且黑暗模式
      : "#ffffff", // 非主页且亮色模式
    color: isHomePage
      ? isDarkMode
        ? "#ffffff" // 主页且黑暗模式
        : "#ffffff" // 主页且亮色模式
      : isDarkMode
      ? "#ffffff" // 非主页且黑暗模式
      : "#333333", // 非主页且亮色模式
  };
};

// 获取Logo过滤色的逻辑
const getLogoFilter = (isHomePage: boolean, isDarkMode: boolean) => {
  // 主页时，Logo总是使用反色滤镜
  if (isHomePage) {
    return "invert(100%) sepia(100%) saturate(0%) hue-rotate(180deg)";
  }
  
  // 非主页时，根据黑暗模式决定是否使用反色滤镜
  return isDarkMode
    ? "invert(100%) sepia(100%) saturate(0%) hue-rotate(180deg)" // 黑暗模式使用反色滤镜
    : "none"; // 亮色模式不使用滤镜
};


export default function Header() {
  const { toggleTheme, isDarkMode } = useTheme();
  const { messages } = useMessage();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

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
    navigate("/");
  };

  const open = Boolean(anchorEl);
  const id = open ? "message-popover" : undefined;

  const openLogoutMenu = Boolean(logoutAnchorEl);
  const logoutId = openLogoutMenu ? "logout-popover" : undefined;

  // 获取头部的样式
  const headerStyles = getHeaderStyles(isHomePage, isDarkMode);
  const logoFilter = getLogoFilter(isHomePage, isDarkMode);

  return (
    <AppBar position="sticky" sx={{ ...headerStyles, boxShadow: 0, paddingLeft: "40px", paddingRight: "40px" }}>
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
                filter: logoFilter, // 应用过滤逻辑
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
        <Box display="flex" alignItems="center">
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
          {isLoggedIn ? (
            <Box display="flex" alignItems="center" sx={{ marginLeft: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "500",
                  fontSize: "16px",
                  color: headerStyles.color, // 使用动态颜色
                  marginRight: "10px",
                }}
              >
                {user.username}
              </Typography>
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  cursor: "pointer",
                  borderRadius: "50%",
                  border: "2px solid",
                  borderColor: isDarkMode ? "#ffffff" : "#1976d2",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  },
                }}
                src={user.avatar}
                alt="User Avatar"
                onClick={handleAvatarClick}
              />
            </Box>
          ) : (
            <Typography variant="body2" sx={loginTextStyles}>
              Please log in
            </Typography>
          )}
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
