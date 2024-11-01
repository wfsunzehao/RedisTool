import React from 'react';
import { Assignment } from '@mui/icons-material';
import NavPage from '../../common/layout/NavPage';

const leftLinks = [
  { title: 'BVT', path: '/create/bvt', icon: <Assignment /> },
  { title: 'MAN', path: '/create/man', icon: <Assignment /> },
  { title: 'PERF', path: '/create/perf', icon: <Assignment /> },
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
