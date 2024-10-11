import React from 'react';
import { Paper, Box, Divider } from '@mui/material';

const Delete: React.FC = () => {
  // 定义变量来控制左右区域的宽度百分比
  const leftPanelWidth = 20; // 左边区域占20%
  const rightPanelWidth = 80; // 右边区域占80%

  return (
    <Paper elevation={3} sx={{ height: '100vh', display: 'flex', overflow: 'hidden' }}>
      {/* 左边区域 */}
      <Box sx={{ width: `${leftPanelWidth}%`, height: '100%', overflow: 'auto' }}>
        <Paper sx={{ height: '100%', p: 2 }} elevation={0}>
          <p>左边区域，占{leftPanelWidth}%</p>
        </Paper>
      </Box>

      {/* 透明的分隔线 */}
      <Divider
        orientation="vertical"
        flexItem
        sx={{ bgcolor: 'transparent', width: '1px', mx: 1 }} // 确保分隔线不会影响布局
      />

      {/* 右边区域 */}
      <Box sx={{ width: `${rightPanelWidth}%`, height: '100%', overflow: 'auto' }}>
        <Paper sx={{ height: '100%', p: 2 }} elevation={0}>
          <p>右边区域，占{rightPanelWidth}%</p>
        </Paper>
      </Box>
    </Paper>
  );
};

export default Delete;