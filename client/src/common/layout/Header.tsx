import { AppBar, Badge, Box, Button, IconButton, List, ListItem, styled, SvgIcon, SvgIconProps, Switch, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from "react-router-dom";
import ChatIcon from '@mui/icons-material/Chat';
import { useTheme } from "../../app/context/ThemeContext";

// const midLinks=[
//   {title: 'catalog', path: '/catalog'},
//   {title: 'about', path: '/about'},
//   {title: 'contact', path: '/contact'},
// ]

const midLinks=[
  {title: 'create', path: '/create'},
  {title: 'delete', path: '/delete'},
  {title: 'other', path: '/other'},
]


const rightLinks=[
  {title: 'login', path: '/login'},
  {title: 'register', path: '/register'}
]

const navStyles = {
  color:'inherit',
  textDecoration:'none',
  typography:'h6',
  '&:hover':{
    color:'grey.500'
  },
  '&.active':{
    color:'text.secondary'
  }
}



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
  return(
    
      <StyledAppBar position="sticky" sx={{mb:4}}>
        <Toolbar sx={{display:'flex', justifyContent:'space-between',alignItems:'center'}}>
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
         <Typography variant="h6" 
              component={NavLink} 
              to="/" 
              sx={navStyles}
            >
              Redis
          </Typography>
          <Switch checked={isDarkMode} onChange={toggleTheme} />

        </Box>
          {/* <Button color="inherit">Login</Button> */}
          <List sx={{display: 'flex'}}>
            {midLinks.map(({title, path})=>(
              <ListItem 
                component={NavLink}
                to={path}
                key={path} 
                sx={navStyles}
              >
                {title.toUpperCase()}
              </ListItem>
            )) }
          </List>

          <Box display='flex' alignItems='center'>
          <IconButton size='large' edge='start' color="inherit" sx={{mr: 2}}>
            <Badge badgeContent={3} color="secondary">
            <ChatIcon />
            </Badge>
          </IconButton>
          <List sx={{display: 'flex'}}>
            {rightLinks.map(({title, path})=>(
              <ListItem 
                component={NavLink}
                to={path}
                key={path} 
                sx={navStyles}>
                {title.toUpperCase()}
              </ListItem>
            )) }
          </List>
          </Box>

        </Toolbar>
      </StyledAppBar>
    

  )
     
  
}