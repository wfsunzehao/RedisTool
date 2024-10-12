import { AppBar, Badge, Box, IconButton, List, ListItem, styled, SvgIcon, SvgIconProps, Switch, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from "react-router-dom";
import ChatIcon from '@mui/icons-material/Chat';
import { useTheme } from "../../app/context/ThemeContext";
import logo from '../../../public/images/wicrecend3.png';

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
  return (
    <StyledAppBar position="sticky" sx={{ mb: 4 }}>
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
          <img src={logo} alt="Logo" style={{ maxHeight: 40, marginRight: 16, objectFit: 'contain',filter: 'invert(100%) sepia(100%) saturate(0%) hue-rotate(180deg)',}} />
          <Switch checked={isDarkMode} onChange={toggleTheme} />
        </Box>
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

        <Box display='flex' alignItems='center'>
          <IconButton size='large' edge='start' color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={3} color="secondary">
              <ChatIcon />
            </Badge>
          </IconButton>
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
