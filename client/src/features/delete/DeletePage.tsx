import { Assignment, Outlet } from "@mui/icons-material";
import { Alert, Box, Link, List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material";

import {Button} from "@nextui-org/button";

const leftLinks = [
  { title: 'All', path: '/delete/all', icon: <Assignment /> },
];

export default function DeletePage() {
  const currentTab = location.pathname.split('/').pop();

  return (
      <Paper elevation={10} sx={{ height: '100vh', display: 'flex', overflow: 'hidden',border: '1px solid #ccc' }} >
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
          <Box sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      paddingTop: '20px',
                    }}
            >
            <Alert severity="info">删除订阅下所有cache</Alert>
            <Box sx={{ width: '40%', padding: '20px' }}>
              {/* 渲染子路由组件 */}
            </Box>
          </Box>
      </Paper>     
  );
}
