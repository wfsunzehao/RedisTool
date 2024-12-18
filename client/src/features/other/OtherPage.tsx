import React from 'react';
import NavPage from '../../common/layout/NavPage';
import { IconDatabaseImport } from '@tabler/icons-react';
import { IconStackMiddle } from '@tabler/icons-react';

const leftLinks = [
  { title: 'Insert Data', path: '/more/insert', icon: <IconDatabaseImport stroke={2} /> },
  { title: 'Find Median', path: '/more/median', icon: <IconStackMiddle stroke={2} /> },
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
