import React from 'react';

import { Assignment } from '@mui/icons-material';
import NavPage from '../../common/layout/NavPage';

const leftLinks = [
  { title: 'group', path: '/delete/group', icon: <Assignment /> },
];

const DeletePage: React.FC = () => {
  return (
    <NavPage 
      links={leftLinks} 
      defaultPath="/delete/group" 
      alertMessage="现在可以删除了!" 
    />
  );
};

export default DeletePage;
