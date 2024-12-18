import React, { useEffect, useState } from 'react'; 
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Paper, List, ListItemText, ListItemIcon, Collapse, ListItemButton } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

interface NavPageProps {
  links: Array<{
    title: string;
    path: string;
    icon: JSX.Element;
    subLinks?: Array<{ title: string; path: string }>;
  }>;
  defaultPath: string;
}

const NavPage: React.FC<NavPageProps> = ({ links, defaultPath }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname.split('/').pop();

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (location.pathname === defaultPath.split('/').slice(0, -1).join('/')) {
      navigate(defaultPath);
    }
  }, [location.pathname, navigate, defaultPath]);

  const isSelected = (path: string) => currentTab === path.split('/').pop();

  const toggleSubMenu = (path: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  return (
    <Paper elevation={10} sx={{ display: 'flex', height: '100vh', paddingLeft: '40px', paddingRight: '40px' }}>
      {/* 左侧导航栏 */}
      <Box
        sx={{
          width: '250px',
          borderRight: '1px solid #ccc',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflowY: 'auto',
          paddingRight: '40px', // 右侧留白
        }}
      >
        <List>
          {links.map(({ title, path, icon, subLinks }) => (
            <div key={title}>
              <ListItemButton
                component={Link}
                to={path}
                selected={isSelected(path)}
                onClick={() => subLinks && toggleSubMenu(path)}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={title} />
                {subLinks && (openMenus[path] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>

              {/* 二级菜单 */}
              {subLinks && (
                <Collapse in={openMenus[path]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {subLinks.map(({ title, path }) => (
                      <ListItemButton
                        key={title}
                        component={Link}
                        to={path}
                        selected={isSelected(path)}
                        sx={{ pl: 10 }}
                      >
                        <ListItemText primary={title} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </List>
      </Box>

      {/* 主内容区域 */}
      <Box sx={{ flex: 1, overflowY: 'auto', padding: 3 }}>
        <Outlet />
      </Box>
    </Paper>
  );
};

export default NavPage;
