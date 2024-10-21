import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Box, Paper, List, ListItem, ListItemText, ListItemIcon, Typography, Alert, Button } from '@mui/material';
import { Assignment } from '@mui/icons-material';

const leftLinks = [
  { title: 'BVT', path: '/create/bvt', icon: <Assignment /> },
  { title: 'MAN', path: '/create/man', icon: <Assignment /> },
  { title: 'PERF', path: '/create/perf', icon: <Assignment /> },
];

const CreatePage: React.FC = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop();
  const [defaultPath] = useState('/create/bvt'); // 默认路径

  // 默认渲染BVT页面
  useEffect(() => {
    if (currentTab === 'create') {
      window.location.href = defaultPath; // 重定向到默认路径
    }
  }, [currentTab, defaultPath]);
  

  return (
    <Paper elevation={10} sx={{ height: '100vh', display: 'flex', border: '1px solid #ccc' }}>
      <Box sx={{ width: '200px', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100%', overflowY: 'auto' }}>
        <List sx={{ paddingTop: '20px' }}>
          {leftLinks.map(({ title, path, icon }) => (
            <ListItem 
              button 
              component={Link} 
              to={path} 
              selected={currentTab === path.split('/').pop()} // 高亮当前选项
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
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
        
        <Alert severity="info">现在BVT已经可以创建</Alert>
        <Box sx={{ width: '40%', padding: '20px' }}>
          <Outlet /> {/* 渲染子路由组件 */}
        </Box>
      </Box>
    </Paper>
  );
};

export default CreatePage;
