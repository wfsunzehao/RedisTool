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

import LoadingComponent from '../../../common/components/CustomLoading';
import { useMessage } from '../../../app/context/MessageContext';
import { Overlay, subscriptionList } from '../../../common/constants/constants';
import { DeleteModel } from '../../../common/models/DeleteModel';


const GroupPage: React.FC = () => {
  const [subscription, setSubscription] = useState('');
  const [group, setGroup] = useState('');
  const [name, setName] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [groupList, setGroupList] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { addMessage } = useMessage();
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
        // const data: DeleteModel = {
        //   subscription,
        //   group,
        // };

        agent.Delete.sendDelGroupJson(subscription,group)
          .then(response => {
            addMessage("Submission was successful!"); // 添加成功消息
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
    setErrors(prevErrors => ({ ...prevErrors, subscription: '' })); // 清除订阅错误
    agent.Create.getGroup(subscriptionid)
      .then(response => { setGroupList(response); })
      .catch(error => console.log(error.response));
  };
  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;

    switch (field) {
      case 'group':
        setGroup(value);
        setErrors(prevErrors => ({ ...prevErrors, group: '' })); // 清除组错误
        break;
      default:
        break;
    }
  };


  return (
    <Box>
      <p style={{ color: '#1976d2', fontSize: '30px', textAlign: 'center' }}>删除cache</p>
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
              onChange={handleInputChange('group')}
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

export default GroupPage;
