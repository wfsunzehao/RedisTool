import React from 'react'; 
import { Assignment } from '@mui/icons-material';
import { Button, List, ListItem, ListItemText, Paper } from '@mui/material';
import NavPage from '../../common/layout/NavPage'; // 使用 SignalContext hook 获取信号量
import { useSignalContext } from '../../app/context/SignalContext';

// 左侧导航栏的链接
const leftLinks = [
  { title: 'MAN', path: '/create/man', icon: <Assignment /> },
  { title: 'BVT', path: '/create/bvt', icon: <Assignment /> },
  { title: 'PERF', path: '/create/perf', icon: <Assignment /> },
  { title: "ALT", path: "/create/ALT", icon: <Assignment /> },
];

// 主页面组件
const CreatePage: React.FC = () => {
  const { randomObjects, clearRandomObjects, sendRandomObjectManually, startTimerManually, stopTimerManually } = useSignalContext();  // 使用 SignalContext hook 获取信号量

  return (
    <NavPage 
      links={leftLinks} 
      defaultPath="/create/man" 
      alertMessage="Now only BVT can create, MAN and PERF stay tuned!"
      children={(
        <>
          {/* 用 Paper 组件将列表包裹起来，添加边框 */}
          <Paper 
            elevation={3} 
            sx={{ 
              padding: '20px', 
              marginTop: '125px', 
              marginBottom: '15px', 
              maxHeight: '400px', // 设置最大高度
              overflowY: 'auto'   // 超过高度时出现垂直滚动条
            }}
          >
            <List>
              {/* 动态展示从 SignalR 获取的 randomObjects 数据 */}
              {randomObjects.slice().reverse().map((item, index) => (  // 使用 reverse() 使最新的数据显示在最上面
                <ListItem key={index}>
                  <ListItemText 
                    primary={`${item.name}`} 
                    secondary={`Time: ${item.time} | Status: ${item.status}`} 
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* 控制按钮 */}
          <Button variant="contained" onClick={clearRandomObjects}>Clear Objects</Button>
          <Button variant="contained" onClick={sendRandomObjectManually}>Get Random Object Manually</Button>
          <Button variant="contained" onClick={startTimerManually}>Start Timer Manually</Button>
          <Button variant="contained" onClick={stopTimerManually}>Stop Timer Manually</Button>
        </>
      )}
      sidebarWidth="200px"   // 修改左侧导航栏宽度
      childrenWidth="40%"    // 修改右侧 children 区域的宽度
      contentWidth="50%"     // 修改主内容区宽度
      marginLeft="250px"     // 修改左边 margin
      flexDirection="row"    // 调整为并排布局
    />
  );
};

export default CreatePage;
