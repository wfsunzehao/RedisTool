import { AppBar, Badge, Box, IconButton, List, ListItem, Popover, Divider, Avatar, MenuItem, Toolbar, Switch } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from "react-router-dom";
import ChatIcon from '@mui/icons-material/Chat';
import { useTheme } from "../../app/context/ThemeContext";
import logo from '../../../public/images/wicrecend3.png';
import { useMessage } from "../../app/context/MessageContext";
import { useState } from "react";
import { useAuth } from "../../app/context/AuthContext";

const midLinks = [
  { title: 'create', path: '/create' },
  { title: 'delete', path: '/delete' },
  { title: 'other', path: '/other' },
];

const rightLinks = [
  { title: 'login', path: '/login' },
];

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
  const { isLoggedIn, setIsLoggedIn } = useAuth(); // 使用 useAuth 获取登录状态
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null); // 用于控制Popover的显示
  const [logoutAnchorEl, setLogoutAnchorEl] = useState<HTMLElement | null>(null); // 用于控制头像下拉菜单

  const handleChatIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setLogoutAnchorEl(event.currentTarget);  // 显示下拉菜单
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');  // 清除 token
    setIsLoggedIn(false);  // 更新登录状态
    setLogoutAnchorEl(null);  // 关闭下拉菜单
  };

  const open = Boolean(anchorEl);
  const id = open ? 'message-popover' : undefined;
  const openLogoutMenu = Boolean(logoutAnchorEl); // 控制头像下拉菜单的打开状态
  const logoutId = openLogoutMenu ? 'logout-popover' : undefined;

  return (
    <AppBar position="sticky" sx={{ mb: 0 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display='flex' alignItems='center'>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <img src={logo} alt="Logo" style={{ maxHeight: 40, marginRight: 16, objectFit: 'contain', filter: 'invert(100%) sepia(100%) saturate(0%) hue-rotate(180deg)' }} />
          <Switch checked={isDarkMode} onChange={toggleTheme} />
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
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
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

          {/* 头像下拉菜单 */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isLoggedIn ? (
              <Avatar
                sx={{ marginLeft: "16px" }}
                src="/path-to-avatar.jpg"
                alt="User Avatar"
                onClick={handleAvatarClick} // 点击头像时显示下拉菜单
              />
            ) : (
              <List sx={{ display: "flex" }}>
                {rightLinks.map(({ title, path }) => (
                  <ListItem key={title}>
                    <NavLink to={path}>{title}</NavLink>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* 头像下拉菜单 */}
          <Popover
            id={logoutId}
            open={openLogoutMenu}
            anchorEl={logoutAnchorEl}
            onClose={() => setLogoutAnchorEl(null)} // 关闭下拉菜单
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem> {/* 注销按钮 */}
          </Popover>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
