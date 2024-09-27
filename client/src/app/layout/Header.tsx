import { AppBar, Badge, Box, Button, IconButton, List, ListItem, SvgIcon, SvgIconProps, Switch, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from "react-router-dom";

const midLinks=[
  {title: 'create', path: '/catalog'},
  {title: 'delete', path: '/about'},
  {title: 'other', path: '/contact'},
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

interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

function HomeIcon(props: SvgIconProps) {
  return (
    <SvgIcon sx={navStyles} {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

export default function Header({darkMode, handleThemeChange}: Props) {
  return(
    
      <AppBar position="sticky" sx={{mb:4}}>
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
          <Switch checked={darkMode} onChange={handleThemeChange} />

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
            <HomeIcon />
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
      </AppBar>
    

  )
     
  
}