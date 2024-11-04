import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Paper, List, ListItem, ListItemText, ListItemIcon, Alert, ListItemButton } from '@mui/material';

interface NavPageProps {
  links: Array<{ title: string; path: string; icon: JSX.Element }>;
  defaultPath: string;
  alertMessage: string;
}

const NavPage: React.FC<NavPageProps> = ({ links, defaultPath, alertMessage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname.split('/').pop();

  useEffect(() => {
    if (location.pathname === defaultPath.split('/').slice(0, -1).join('/')) {
      navigate(defaultPath);
    }
  }, [location.pathname, navigate, defaultPath]);

  const isSelected = (path: string) => currentTab === path.split('/').pop();

  return (
    <Paper elevation={10} sx={{ height: '100vh', display: 'flex', border: '1px solid #ccc' }}>
      <Box sx={{
        width: '200px',
        borderRight: '1px solid #ccc',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100%',
        overflowY: 'auto'
      }}>
        <List sx={{ paddingTop: '20px' }}>
          {links.map(({ title, path, icon }) => (
            <ListItemButton
              component={Link}
              to={path}
              selected={isSelected(path)}
              key={title}
            >
              <ListItemIcon>
                {icon}
              </ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
      }}>
        <Alert severity="info" sx={{ width: '600px', margin: '0 auto' }}>
          {alertMessage}
        </Alert>
        <Box sx={{ width: '40%', padding: '20px' }}>
          <Outlet />
        </Box>
      </Box>
    </Paper>
  );
};

export default NavPage;
