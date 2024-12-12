import React from 'react';
import { Assignment } from '@mui/icons-material';
import NavPage from '../../common/layout/NavPage';

const leftLinks = [
  { title: 'Insert', path: '/more/insert', icon: <Assignment /> },
  { title: 'Median', path: '/more/median', icon: <Assignment /> },
];

const OtherPage: React.FC = () => {
  return (
    <NavPage 
      links={leftLinks} 
      defaultPath="/more/insert" 
      alertMessage="You can insert it now!" 
    />
  );
};

export default OtherPage;
