import React, { useState } from "react";
import { AppBar, Box, IconButton, List, ListItem, Popover, Badge, Avatar, MenuItem, Toolbar, Button, Divider } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from "react-router-dom";
import ChatIcon from '@mui/icons-material/Chat';
import { useTheme } from "../../app/context/ThemeContext";
import logo from '../../../public/images/wicrecend3.png';
import { useMessage } from "../../app/context/MessageContext";
import { useAuth } from "../../app/context/AuthContext";
import LoginPage from "../../features/login/LoginPage";
import { Switch } from "@nextui-org/react";
import { SunIcon } from "../icon/SunIcon";
import { MoonIcon } from "../icon/MoonIcon";
 // 引入 LoginPage

const midLinks = [
  { title: 'create', path: '/create' },
  { title: 'delete', path: '/delete' },
  { title: 'benchmark', path: '/benchmark' },
  { title: 'other', path: '/other' },
];

const rightLinks = [
  { title: 'login', path: '/login' },
];
//midLinks的样式
const navStyles = {
  color: 'inherit',
  textDecoration: 'none',
  typography: 'h6',
  '&:hover': {
    color: 'grey.500',
  },
  '&.active': {
    color: 'text.secondary',
  },
};

export default function Header() {
  const { toggleTheme, isDarkMode } = useTheme();
  const { messages } = useMessage();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [logoutAnchorEl, setLogoutAnchorEl] = useState<HTMLElement | null>(null);
  const [openLoginDialog, setOpenLoginDialog] = useState(false); // 控制登录对话框的显示

  const handleChatIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setLogoutAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setLogoutAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'message-popover' : undefined;
  const openLogoutMenu = Boolean(logoutAnchorEl);
  const logoutId = openLogoutMenu ? 'logout-popover' : undefined;

  return (
    <AppBar position="sticky" sx={{ mb: 0 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display='flex' alignItems='center'>
          <img src={logo} alt="Logo" style={{ maxHeight: 40, marginRight: 16, objectFit: 'contain', filter: 'invert(100%) sepia(100%) saturate(0%) hue-rotate(180deg)' }} />
          {/* <Switch checked={isDarkMode} onChange={toggleTheme} /> */}
          <Switch
            defaultSelected
            checked={isDarkMode}
            onChange={toggleTheme}
            size="lg"
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <SunIcon className={className} style={{ fontSize: '50px' }} /> // 增大图标大小
              ) : (
                <MoonIcon className={className} style={{ fontSize: '50px' }} /> // 增大图标大小
              )
            }
          />
        </Box>
        <Box display='flex' alignItems='center'>
          <List sx={{ display: 'flex' }}>
            <ListItem component={NavLink} to="/" sx={navStyles}>
              HOME
            </ListItem>
            {midLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
          <IconButton size='large' edge='start' color="inherit" sx={{ mr: 2 }} onClick={handleChatIconClick}>
            <Badge badgeContent={messages.length} color="secondary">
              <ChatIcon />
            </Badge>
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ transform: 'translateX(250px)' }}
          >
            {messages.length > 0 ? (
              <List>
                {messages.map(({ text, timestamp }, index) => (
                  <div key={index}>
                    <ListItem>
                      <Box>
                        今日第{index + 1}次提交: {text}
                        <br />
                        <small>{new Date(timestamp).toLocaleString()}</small>
                      </Box>
                    </ListItem>
                    {index < messages.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
            ) : (
              <Box sx={{ padding: 2 }}>没有消息</Box>
            )}
          </Popover>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isLoggedIn ? (
              <Avatar sx={{ marginLeft: "16px" }} src="/path-to-avatar.jpg" alt="User Avatar" onClick={handleAvatarClick} />
            ) : (
              <List sx={{ display: "flex" }}>
                {rightLinks.map(({ title }) => (
                  <ListItem key={title}>
                    <Button onClick={() => setOpenLoginDialog(true)} color="inherit">
                      {title}
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          <Popover
            id={logoutId}
            open={openLogoutMenu}
            anchorEl={logoutAnchorEl}
            onClose={() => setLogoutAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Popover>
        </Box>
      </Toolbar>

      {/* 登录对话框 */}
      {openLoginDialog && <LoginPage onClose={() => setOpenLoginDialog(false)} />}
    </AppBar>
  );
}
