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
import { Overlay, subscriptionList } from '../../create/constants';


const InsertPage: React.FC = () => {
  const [subscription, setSubscription] = useState('');
  const [group, setGroup] = useState('');
  const [name, setName] = useState(''); 
  const [quantity, setQuantity] = useState<number>(); // 数量
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
    if (!name) newErrors.name = "名称不能为空"; // 新增名称验证
    if (!quantity) newErrors.quantity = "数量不能为空"; // 新增名称验证
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
          name:name,
          region: 'Central US EUAP', // 这里替换为实际的region值
          subscription,
          group,
          port:'6379'
          // 添加其他字段的值
        };

        //agent.Other.sendInsertJson(data)正式接口
        agent.Create.sendManJson(data)//测试接口
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
    setName(''); // 清空名称输入
    setQuantity(''); // 清空数量输入
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
      case 'name':
        setName(value);
        setErrors(prevErrors => ({ ...prevErrors, name: '' })); // 清除名称错误
        break;
      case 'quantity':
        setQuantity(value);
        setErrors(prevErrors => ({ ...prevErrors, quantity: '' })); // 清除数量错误
        break;
      default:
        break;
    }
  };

  return (
    <Box>
      <p style={{ color: '#1976d2', fontSize: '30px', textAlign: 'center' }}>插入数据</p>
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
              onChange={handleInputChange('group')} // 使用通用方法
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
          <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
            <TextField
              label="Name"
              value={name}
              onChange={handleInputChange('name')} // 使用通用方法
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              disabled={loading}
            >
            </TextField>
          </FormControl>
          <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
            <TextField
              label="Quantity"
              value={quantity}
              onChange={handleInputChange('quantity')} // 使用通用方法
              variant="outlined"
              error={!!errors.quantity}
              helperText={errors.quantity}
              fullWidth
              disabled={loading}
            >
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
          <LoadingComponent message='正在提交，请稍候...' />
        </Overlay>
      )}
    </Box>
  );
};

export default InsertPage;
