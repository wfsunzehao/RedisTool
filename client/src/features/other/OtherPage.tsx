import React from 'react';
import { Assignment } from '@mui/icons-material';
import NavPage from '../../common/layout/NavPage';

const leftLinks = [
  { title: 'insert', path: '/other/insert', icon: <Assignment /> },
  { title: 'median', path: '/other/median', icon: <Assignment /> },
  { title: 'signal', path: '/other/signal', icon: <Assignment /> },
];

const OtherPage: React.FC = () => {
  return (
    <NavPage 
      links={leftLinks} 
      defaultPath="/other/insert" 
      alertMessage="You can insert it now!" 
    />
  );
};

export default OtherPage;
