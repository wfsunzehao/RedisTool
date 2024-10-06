import React from 'react';  
import { Checkbox, FormControlLabel, FormGroup, Grid, Paper } from '@mui/material';
import Sidebar from './Sidebar'; 
import CacheForm from './CacheForm'; 
  
export default function Test() {  
  return (  
    <Grid container spacing={4}>  
      {/* 主内容容器，可以是整个页面的宽度 */}  
      <Grid item xs={12}>  
        {/* 内部的布局，侧边栏和主内容 */}  
        <Grid container spacing={4} direction="row" justifyContent="flex-start" alignItems="stretch">  
          {/* 侧边栏部分，现在它是表格的左侧 */}  
          <Grid item xs={3}>  
         
          </Grid>  
          {/* 主内容部分，现在是表格的右侧 */}  
          <Grid item xs={9} style={{ padding: '16px' }}>  
            <CacheForm />  
          </Grid>  
        </Grid>  
      </Grid>  
    </Grid>  
  );  
};