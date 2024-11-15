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
      alertMessage="You can delete it now!" 
    />
  );
};

export default DeletePage;
