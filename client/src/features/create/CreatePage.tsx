import React from 'react';
import { Assignment } from '@mui/icons-material';
import { Button, List, ListItem, ListItemText, Paper } from '@mui/material';
import NavPage from '../../common/layout/NavPage';

// 左侧导航栏的链接
const leftLinks = [
  { title: 'MAN', path: '/create/man', icon: <Assignment /> },
  { title: 'BVT', path: '/create/bvt', icon: <Assignment /> },
  { title: 'PERF', path: '/create/perf', icon: <Assignment /> },
  { title: "ALT", path: "/create/ALT", icon: <Assignment /> },
];

// 模拟的静态数据（常数），包含名字、时间和状态
const data = [
  { name: "Object_1", time: "2024-11-21 12:00:00", status: "Running" },
  { name: "Object_2", time: "2024-11-21 12:02:00", status: "Creating" },
  { name: "Object_3", time: "2024-11-21 12:04:00", status: "Deleting" },
  { name: "Object_4", time: "2024-11-21 12:06:00", status: "Running" },
  { name: "Object_5", time: "2024-11-21 12:08:00", status: "Creating" },
];

// 主页面组件
const CreatePage: React.FC = () => {
  return (
    <NavPage 
      links={leftLinks} 
      defaultPath="/create/man" 
      alertMessage="Now only BVT can create, MAN and PERF stay tuned!"
      children={(
        <>
          {/* 用 Paper 组件将列表包裹起来，添加边框 */}
          <Paper elevation={3} sx={{ padding: '20px', marginTop: '125px', marginBottom: '15px' }}>
            <List>
              {data.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={`${item.name}`} 
                    secondary={`Time: ${item.time} | Status: ${item.status}`} 
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

        </>
      )}
      sidebarWidth="200px"   // 修改左侧导航栏宽度
      childrenWidth="40%"    // 修改右侧 children 区域的宽度
      contentWidth="50%"     // 修改主内容区宽度
      marginLeft="250px"     // 修改左边 margin
      flexDirection="row"    // 调整为并排布局
    />
  );
};

export default CreatePage;
