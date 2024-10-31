import React, { useState } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import swal from 'sweetalert';
import agent from '../../../app/api/agent';
import LoadingComponent from '../../../common/components/CustomLoading';
import { Overlay } from '../../../common/constants/constants';

const MedianPage: React.FC = () => {
  const [folderPath, setFolderPath] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFolderSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fullPath = files[0].webkitRelativePath; // 获取完整路径
      const path = fullPath.substring(0, fullPath.lastIndexOf('/')); // 提取文件夹路径
      setFolderPath(path);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!folderPath) {
      swal("错误!", "请选择文件夹", "error");
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
        
        agent.Other.sendOtherJson({ path: folderPath })
          .then(response => {
            console.log(response);
            swal("成功!", "文件夹处理成功!", "success");
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
      <Typography variant="h4" sx={{ color: '#1976d2' }}>选择文件夹路径</Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <TextField
            value={folderPath}
            onChange={() => {}} // 只读输入框
            variant="outlined"
            label="已选择文件夹"
            fullWidth
            sx={{ flexGrow: 1 }}
          />
          <input
            type="file"
            webkitdirectory="true"
            onChange={handleFolderSelect}
            style={{ display: 'none' }}
            id="folder-input"
            multiple
          />
          <label htmlFor="folder-input">
            <Button variant="contained" component="span" sx={{ marginLeft: 2 }}>
              选择文件夹
            </Button>
          </label>
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
