import React, { useState } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import swal from 'sweetalert';
import { Overlay } from '../../../common/constants/constants';
import LoadingComponent from '../../../common/components/CustomLoading';

const MedianPage: React.FC = () => {
  const [folderPath, setFolderPath] = useState<string>('D:\\Tests\\Alt\\Latency'); // Default path
  const [loading, setLoading] = useState<boolean>(false);

  // 处理路径输入框的变化
  const handleFolderPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderPath(event.target.value);
  };

  // 提交表单
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!folderPath) {
      swal("Error!", "Path cannot be empty", "error");
      return;
    }

    swal({
      title: "Confirm Action",
      text: "Do you want to start processing this folder?",
      buttons: ["Cancel", "Confirm"],
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
              throw new Error("Unable to generate report");
            }
          })
          .then(blob => {
            // 创建 Blob URL
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'Median_Report.xlsx'; // Set the download file name
            link.click(); // Trigger the download
            swal("Success!", "Folder processed successfully! Excel report has been downloaded!", "success");
          })
          .catch(error => {
            console.error(error);
            swal("Error!", "An error occurred while processing the folder", "error");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h4" sx={{ color: '#1976d2' }}>Enter the folder path</Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <TextField
            value={folderPath}
            onChange={handleFolderPathChange} // User modifies the path
            variant="outlined"
            label="Folder Path"
            fullWidth
            sx={{ flexGrow: 1 }}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mx: 1,textTransform: "none"  }}>
            Submit
          </Button>
        </Box>
      </form>
      {loading && (
        <Overlay>
          <LoadingComponent message='Processing, please wait...' />
        </Overlay>
      )}
    </Box>
  );
};

export default MedianPage;
