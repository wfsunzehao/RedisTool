import React from 'react';
import { Assignment } from '@mui/icons-material';
import NavPage from '../../common/layout/NavPage'; //

// 左侧导航栏的链接
const leftLinks = [
  { title: 'MAN', path: '/create/man', icon: <Assignment /> },
  { title: 'BVT', path: '/create/bvt', icon: <Assignment /> },
  { title: 'PERF', path: '/create/perf', icon: <Assignment /> },
  { title: "ALT", path: "/create/ALT", icon: <Assignment /> },
];

// 主页面组件
const CreatePage: React.FC = () => {
  //const { randomObjects, clearRandomObjects, sendRandomObjectManually, startTimerManually, stopTimerManually } = useSignalContext();  // 使用 SignalContext hook 获取信号量
  //const theme = useTheme(); // 获取当前的主题

  return (
    <NavPage 
      links={leftLinks} 
      defaultPath="/create/man" 
      alertMessage="BVT: Client recommends manual creation"
      // children={(
      //   <>
      //     {/* 使用 Box 组件给 children 区域添加一个固定大小 */}
      //     <Box 
      //       sx={{
      //         width: '600px',                  // 设置固定宽度
      //         height: '400px',                 // 设置固定高度
      //         border: '1px solid #ddd',        // 添加边框
      //         borderRadius: '8px',             // 圆角效果
      //         padding: '20px',                 // 内边距
      //         marginTop: '125px',              // 上外边距
      //         marginBottom: '15px',            // 下外边距
      //         backgroundColor: theme.palette.mode === 'dark' ? '#303030' : '#f9f9f9',      // 背景色
      //         overflow: 'hidden',              // 隐藏溢出内容
      //       }}
      //     >
      //       {/* 用 Paper 组件将列表包裹起来，添加边框 */}
      //       <Paper 
      //         elevation={3} 
      //         sx={{ 
      //           padding: '20px', 
      //           height: '100%', 
      //           overflowY: 'auto',
      //           backgroundColor: theme.palette.mode === 'dark' ? '#303030' : '#white',  // 根据主题设置背景色
      //         }}
      //       >
      //         <List>
      //           {/* 动态展示从 SignalR 获取的 randomObjects 数据 */}
      //           {randomObjects.slice().reverse().map((item, index) => (  // 使用 reverse() 使最新的数据显示在最上面
      //             <ListItem key={index}>
      //               <ListItemText 
      //                 primary={`${item.name}`} 
      //                 secondary={`Time: ${item.time} | Status: ${item.status}`} 
      //               />
      //             </ListItem>
      //           ))}
      //         </List>
      //       </Paper>
      //     </Box>

      //     {/* 控制按钮 */}
      //     <Box sx={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
      //       <Button variant="contained" onClick={clearRandomObjects}>Clear Objects</Button>
      //       <Button variant="contained" onClick={sendRandomObjectManually}>Get Random Object Manually</Button>
      //       <Button variant="contained" onClick={startTimerManually}>Start Timer Manually</Button>
      //       <Button variant="contained" onClick={stopTimerManually}>Stop Timer Manually</Button>
      //     </Box>
      //   </>
      // )}
      // sidebarWidth="200px"   // 修改左侧导航栏宽度
      // childrenWidth="40%"    // 修改右侧 children 区域的宽度
      // contentWidth="50%"     // 修改主内容区宽度
      // marginLeft="250px"     // 修改左边 margin
      // flexDirection="row"    // 调整为并排布局
    />
  );
};

export default CreatePage;
