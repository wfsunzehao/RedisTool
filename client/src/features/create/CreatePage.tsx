import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Box, Paper, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import { Assignment } from '@mui/icons-material'; // 示例图标


const leftLinks = [
  { title: 'BVT', path: '/create/bvt', icon: <Assignment /> },
  { title: 'MAN', path: '/create/man', icon: <Assignment /> },
  { title: 'PERF', path: '/create/perf', icon: <Assignment /> },
];

const CreatePage: React.FC = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop();

  return (
    <Paper elevation={10} sx={{ height: '100vh', display: 'flex', border: '1px solid #ccc' }}>
      <Box sx={{ width: '200px', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100%', overflowY: 'auto' }}>
        <List sx={{ paddingTop: '20px' }}> {/* 添加顶部内边距，避免被Header覆盖 */}
          {leftLinks.map(({ title, path, icon }) => (
            <ListItem 
              button 
              component={Link} 
              to={path} 
              selected={currentTab === path.split('/').pop()} // 高亮当前选项
              key={title}
            >
              <ListItemIcon>
                {icon} {/* 在这里渲染图标 */}
              </ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px'}}>
        <Typography variant="body1" color="warning.main" textAlign="center">
          注意事项：请确保填写的信息准确无误。
        </Typography>
        <Box sx={{ width: '40%', padding: '20px'}}> {/* 确保 Outlet 区域的宽度更大 */}
          <Outlet /> {/* 这里将渲染子路由组件 */}
        </Box>
      </Box>
    </Paper>
  );
};

export default CreatePage;
