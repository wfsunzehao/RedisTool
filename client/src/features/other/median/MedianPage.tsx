import React, { useState } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import swal from 'sweetalert';
import { Overlay } from '../../../common/constants/constants';
import LoadingComponent from '../../../common/components/CustomLoading';

const MedianPage: React.FC = () => {
  const [folderPath, setFolderPath] = useState<string>('D:\\Tests\\Alt\\Latency'); // 默认路径
  const [loading, setLoading] = useState<boolean>(false);

  // 处理路径输入框的变化
  const handleFolderPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderPath(event.target.value);
  };

  // 提交表单
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!folderPath) {
      swal("错误!", "路径不能为空", "error");
      return;
    }

    swal({
      title: "确认操作",
      text: "开始处理该文件夹吗？",
      buttons: ["取消", "确认"],
      dangerMode: true,
    }).then((willSubmit) => {
      if (willSubmit) {
        setLoading(true);

        // 将文件夹路径传递给后端，使用 fetch 来获取 Excel 文件
        fetch('https://localhost:7179/api/Median/sendMedianJson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: folderPath })
        })
          .then(response => {
            if (response.ok) {
              // 返回的是 Excel 文件内容
              return response.blob();
            } else {
              throw new Error("无法生成报告");
            }
          })
          .then(blob => {
            // 创建 Blob URL
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'Median_Report.xlsx'; // 设置下载文件名
            link.click(); // 触发下载
            swal("成功!", "文件夹处理成功！Excel 报告已下载！", "success");
          })
          .catch(error => {
            console.error(error);
            swal("错误!", "处理文件夹时发生错误", "error");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h4" sx={{ color: '#1976d2' }}>输入文件夹路径</Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <TextField
            value={folderPath}
            onChange={handleFolderPathChange} // 用户修改路径
            variant="outlined"
            label="文件夹路径"
            fullWidth
            sx={{ flexGrow: 1 }}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            开始
          </Button>
        </Box>
      </form>
      {loading && (
        <Overlay>
          <LoadingComponent message='正在处理，请稍候...' />
        </Overlay>
      )}
    </Box>
  );
};

export default MedianPage;
