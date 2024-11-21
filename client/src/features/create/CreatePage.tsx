import React from 'react';
import { Assignment } from '@mui/icons-material';
import { TextField, Button } from '@mui/material';
import NavPage from '../../common/layout/NavPage';

const leftLinks = [
  { title: 'MAN', path: '/create/man', icon: <Assignment /> },
  { title: 'BVT', path: '/create/bvt', icon: <Assignment /> },
  { title: 'PERF', path: '/create/perf', icon: <Assignment /> },
  { title: "ALT", path: "/create/ALT", icon: <Assignment /> },
];

const CreatePage: React.FC = () => {
  return (
    <NavPage 
      links={leftLinks} 
      defaultPath="/create/man" 
      alertMessage="Now only BVT can create, MAN and PERF stay tuned!"
      children={(
        <>
          <TextField label="Enter your name" variant="outlined" fullWidth sx={{ marginTop: '125px',marginBottom: '15px'}} />
          <Button variant="contained" color="primary">Submit</Button>
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
