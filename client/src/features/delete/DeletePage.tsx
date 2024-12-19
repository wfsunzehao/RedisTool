import React from 'react';

import NavPage from '../../common/layout/NavPage';
import { IconHttpDelete } from '@tabler/icons-react';

const leftLinks = [
  { title: 'Delete by group', path: '/delete/group', icon: <IconHttpDelete stroke={2} />},
];

const DeletePage: React.FC = () => {
  return (
    <NavPage 
      links={leftLinks} 
      defaultPath="/delete/group" 
      alertMessage="Please delete by group" 
    />
  );
};

export default DeletePage;
