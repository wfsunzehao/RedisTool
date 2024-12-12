import React from 'react';
import { Assignment } from '@mui/icons-material';
import NavPage from '../../common/layout/NavPage'; //

// 左侧导航栏的链接
const leftLinks = [
  { title: 'Manual ', path: '/create/man', icon: <Assignment /> },
  { title: 'Bvt', path: '/create/bvt', icon: <Assignment /> },
  { title: 'Performance ', path: '/create/perf', icon: <Assignment /> },
  { title: "Alt", path: "/create/alt", icon: <Assignment /> },
];

// 主页面组件
const CreatePage: React.FC = () => {
  return (
    <NavPage 
      links={leftLinks} 
      defaultPath="/create/man" 
      alertMessage="BVT: Client recommends manual creation"
    />
  );
};

export default CreatePage;
