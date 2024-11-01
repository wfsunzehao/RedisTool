import React from 'react';
import { Assignment } from '@mui/icons-material';
import NavPage from '../../common/layout/NavPage';

const leftLinks = [
  { title: 'insert', path: '/other/insert', icon: <Assignment /> },
  { title: 'median', path: '/other/median', icon: <Assignment /> },
];

const OtherPage: React.FC = () => {
  return (
    <NavPage 
      links={leftLinks} 
      defaultPath="/other/insert" 
      alertMessage="现在可以插入了!" 
    />
  );
};

export default OtherPage;
