import { Box, Paper } from "@mui/material";

export default function DeletePage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // 设置容器高度为视口高度
        margin: 0, // 去除外边距
      }}
    >
      <Paper
        sx={{
          flex: '1 0 auto', // 让 Paper 填满剩余空间
          width: '100%', // 确保宽度铺满
          padding: 2, // 可选：设置内边距
          boxSizing: 'border-box', // 确保 padding 包含在宽度计算中
        }}
      >
        <h1>Delete Page</h1>
      </Paper>
      <Box
        sx={{
          flex: '0 0 auto', // 让 Box 保持固定高度
          padding: 2, // 可选：设置内边距
        }}
      >
        <h1>Other Content</h1>
      </Box>
    </Box>
  );
}
