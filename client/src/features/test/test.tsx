import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import CreateForm from './CacheForm';
import Sidebar from './SideBar';

const Test: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Sidebar onSelect={setSelectedType} />
      </Grid>
      <Grid item xs={9}>
        {selectedType && <CreateForm type={selectedType} />}
      </Grid>
    </Grid>
  );
};

export default Test;