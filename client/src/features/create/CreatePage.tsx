import React from 'react';
import { Assignment } from '@mui/icons-material';
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
      defaultPath="/create/bvt" 
      alertMessage="Now only BVT can create, MAN and PERF stay tuned!" 
    />
  );
};

export default CreatePage;
