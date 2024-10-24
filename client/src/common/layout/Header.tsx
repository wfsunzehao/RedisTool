import { AppBar, Badge, Box, IconButton, InputAdornment, List, ListItem, styled, SvgIcon, SvgIconProps, Switch, TextField, Toolbar, Typography, Popover, Divider } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from "react-router-dom";
import ChatIcon from '@mui/icons-material/Chat';
import { useTheme } from "../../app/context/ThemeContext";
import logo from '../../../public/images/wicrecend3.png';
import { useMessage } from "../../app/context/MessageContext";
import { useState } from "react";

const midLinks = [
  { title: 'create', path: '/create' },
  { title: 'delete', path: '/delete' },
  { title: 'other', path: '/other' },
];

const rightLinks = [
  { title: 'login', path: '/login' },
  { title: 'register', path: '/register' },
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

function HomeIcon(props: SvgIconProps) {
  return (
    <SvgIcon sx={navStyles} {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1, // 确保在其他组件之上
}));

export default function Header() {
  const { toggleTheme, isDarkMode } = useTheme();
  const { messages } = useMessage();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChatIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'message-popover' : undefined;

  return (
    <StyledAppBar position="sticky" sx={{ mb: 0 }}>
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
          {/* 使用maxHeight来控制图片大小 */}
          <img src={logo} alt="Logo" style={{ maxHeight: 40, marginRight: 16, objectFit: 'contain', filter: 'invert(100%) sepia(100%) saturate(0%) hue-rotate(180deg)' }} />
          <Switch checked={isDarkMode} onChange={toggleTheme} />
        </Box>
        <Box display='flex' alignItems='center'>
          <List sx={{ display: 'flex' }}>
            <ListItem 
              component={NavLink}
              to="/"
              sx={navStyles}
            >
              HOME
            </ListItem>
            {midLinks.map(({ title, path }) => (
              <ListItem
                component={NavLink}
                to={path}
                key={path}
                sx={navStyles}
              >
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
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{ transform: 'translateX(250px)'}} // 可选：设置 margin 以确保更好的对齐
          >
            {messages.length > 0 ? (
            <List>
              {messages.map(({ text, timestamp }, index) => (
                <div key={index}>
                  <ListItem>
                    <Box>
                      今日第{index + 1}次提交: {text}
                      <br />
                      &nbsp;&nbsp;&nbsp;<small>{new Date(timestamp).toLocaleString()}</small> {/* 格式化时间戳 */}
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
          <List sx={{ display: 'flex' }}>
            {rightLinks.map(({ title, path }) => (
              <ListItem
                component={NavLink}
                to={path}
                key={path}
                sx={navStyles}
              >
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}