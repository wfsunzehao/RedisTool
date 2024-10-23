import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Paper, List, ListItem, ListItemText, ListItemIcon, Alert } from '@mui/material';
import { Assignment } from '@mui/icons-material';

const leftLinks = [
  { title: 'insert', path: '/other/insert', icon: <Assignment /> },
];

const OtherPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname.split('/').pop();
  const defaultPath = '/other/insert';

  // 如果当前路径是'/create'，则重定向到默认路径
  useEffect(() => {
    if (location.pathname === '/other') {
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
          {leftLinks.map(({ title, path, icon }) => (
            <ListItem 
              button 
              component={Link} 
              to={path} 
              selected={isSelected(path)} // 使用封装的函数判断选中状态
              key={title}
            >
              <ListItemIcon>
                {icon}
              </ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          paddingTop: '20px',
        }}
      >
        <Alert severity="info" sx={{width: '600px', margin: '0 auto'}}>
          现在可以插入了!
        </Alert>
        <Box sx={{ width: '40%', padding: '20px' }}>
          <Outlet /> {/* 渲染子路由组件 */}
        </Box>
      </Box>
    </Paper>
  );
};

export default OtherPage;
