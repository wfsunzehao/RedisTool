import React from 'react';
import { Assignment } from '@mui/icons-material';
import NavPage from '../../common/layout/NavPage'; //

// 左侧导航栏的链接
const leftLinks = [
  { title: 'MAN', path: '/create/man', icon: <Assignment /> },
  { title: 'BVT', path: '/create/bvt', icon: <Assignment /> },
  { title: 'PERF', path: '/create/perf', icon: <Assignment /> },
  { title: "ALT", path: "/create/ALT", icon: <Assignment /> },
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
