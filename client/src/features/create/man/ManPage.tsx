import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  TextField,
} from '@mui/material';
import swal from 'sweetalert';
import agent from '../../../app/api/agent';
import { DataModel } from '../../../common/models/DataModel';
import { Overlay, subscriptionList } from '../constants';
import LoadingComponent from '../../../common/components/CustomLoading';


const ManPage: React.FC = () => {
  const [subscription, setSubscription] = useState('');
  const [group, setGroup] = useState('');
  const [name, setName] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [groupList, setGroupList] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  //初始化
  useEffect(() => {
    //默认显示Cache Team - Vendor CTI Testing 2
    setSubscription("1e57c478-0901-4c02-8d35-49db234b78d2");
    agent.Create.getGroup("1e57c478-0901-4c02-8d35-49db234b78d2")
    .then(response => { setGroupList(response);})
    .catch(error => console.log(error.response))
  },[])

  //校验表单
  const CheckForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!subscription) newErrors.subscription = "订阅不能为空";
    if (!group) newErrors.group = "组不能为空";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // 返回是否有错误
  };


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // 校验表单
    if (!CheckForm()) {
      return; // 如果有错误，停止提交
    }

    swal({
      title: "Confirm the operation",
      text: "Once started, the cache used in BVT will be created!",
      buttons: ["No", "Yes!"],
      dangerMode: true,
      closeOnClickOutside: false, // 防止点击外部关闭
    }).then((willSubmit) => {
      setLoading(true);
      if (willSubmit) {
        // 提交逻辑
        const data: DataModel = {
          name,
          region: 'Central US EUAP', // 这里替换为实际的region值
          subscription,
          group,
          port:'6379'
          // 添加其他字段的值
        };

        agent.Create.sendManJson(data)
          .then(response => {
            console.log(response);
            swal({
              title: "Submission was successful!",
              icon: "success",
              button: "OK!",
              content: {
                element: "div",
                attributes: {
                  innerHTML: "Go to <a href='https://portal.azure.com' target='_blank'>Azure portal</a>",
                },
              },
            });
          })
          .catch(error => {
            console.log(error.response);
            swal({
              title: "Error!",
              text: "There was an issue with your submission.",
              icon: "error",
              button: "OK!",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  };
  // 处理取消按钮点击事件
  const handleCancel = () => {
    setSubscription('');
    setGroup('');
    setErrors({});
  };
  // 处理下拉框改变事件
  const handleSubChange = (subscriptionid: string) => {
    setSubscription(subscriptionid);
    agent.Create.getGroup(subscriptionid)
      .then(response => { setGroupList(response); })
      .catch(error => console.log(error.response));
  };

  return (
    <Box>
      <p style={{ color: '#1976d2', fontSize: '30px', textAlign: 'center' }}>创建：Man Cache</p>
      <form className="submit-box" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
            <TextField
              select
              label={`订阅`}
              value={subscription}
              onChange={(e) => handleSubChange(e.target.value)}
              variant="outlined"
              error={!!errors.subscription}
              helperText={errors.subscription}
              fullWidth
              disabled={loading}
            >
              {subscriptionList.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
            <TextField
              select
              label="Group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              variant="outlined"
              error={!!errors.group}
              helperText={errors.group}
              fullWidth
              disabled={loading}
            >
              {groupList.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" sx={{ mx: 1 }} disabled={loading}>
            提交
          </Button>
          <Button type="button" variant="outlined" color="secondary" onClick={handleCancel} sx={{ mx: 1 }} disabled={loading}>
            取消
          </Button>
        </Box>
      </form>
      {loading && (
        <Overlay>
          <LoadingComponent />
        </Overlay>
      )}
    </Box>
  );
};

export default ManPage;
