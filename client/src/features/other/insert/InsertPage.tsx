import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  TextField,
} from '@mui/material';
import agent from '../../../app/api/agent';
import { DataModel } from '../../../common/models/DataModel';

import LoadingComponent from '../../../common/components/CustomLoading';
import { Overlay, subscriptionList } from '../../../common/constants/constants';
import { handleGenericSubmit } from '../../../app/util/util';


const InsertPage: React.FC = () => {
  const [subscription, setSubscription] = useState('');
  const [group, setGroup] = useState('');
  const [name, setName] = useState(''); 
  const [quantity, setQuantity] = useState(''); // 数量
  const [loading, setLoading] = useState(false);
  const [groupList, setGroupList] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [resourceList, setResourceList] = useState<string[]>([]); // 资源列表状态
  //初始化
  useEffect(() => {
    //默认显示Cache Team - Vendor CTI Testing 2
    setSubscription("1e57c478-0901-4c02-8d35-49db234b78d2");
    agent.Create.getGroup("1e57c478-0901-4c02-8d35-49db234b78d2")
    .then(response => { 
      const sortedResponse = response.sort((a: string, b: string) =>
        a.toLowerCase().localeCompare(b.toLowerCase()) // 忽略大小写排序
      );
      setGroupList(sortedResponse);
    })
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


  const apiPathFunction = async (data: DataModel) => {
    return await agent.Other.sendInsertJson(data); // 或其他 API 调用
  };
  const handleSubmit = (event: React.FormEvent) => {
      // 提交逻辑
      const data: DataModel = {
        name,
        region: 'Central US EUAP', // 这里替换为实际的region值
        subscription,
        group,
        port:'6379',
        // 添加其他字段的值
        numKeysPerShard:quantity,
      };
      const customMessage = "Once started, the cache will be inserted!";    
      handleGenericSubmit(event, data, apiPathFunction, CheckForm, setLoading,customMessage); 
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
      .then(response => { 
        const sortedResponse = response.sort((a: string, b: string) =>
          a.toLowerCase().localeCompare(b.toLowerCase()) // 忽略大小写排序
        );
        setGroupList(sortedResponse);
      })
      .catch(error => console.log(error.response));
  };
  // 组选择改变时
  const handleGroupChange = (group: string) => {
    setGroup(group);
    setErrors(prevErrors => ({ ...prevErrors, group: '' })); // 清除组错误

    // 调用API获取该组的资源列表
    agent.Delete.getResource(subscription, group)
    .then(response => {
      // 提取出所有资源的 ID（即键），形成一个字符串数组
      const resourceList = Object.keys(response);

      // 保存资源列表（字符串数组）
      setResourceList(resourceList);
    })
    .catch(error => {
      console.log(error.response);
      setResourceList([]);  // 清空资源列表
    });

  };
  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;

    switch (field) {
      case 'group':
        handleGroupChange(value);
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
      <p style={{ color: '#1976d2', fontSize: '30px', textAlign: 'center' }}>insert data</p>
      <form className="submit-box" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        
          <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
            <TextField
              select
              label={`Subscription`}
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
              disabled={loading || !subscription}  // 只有选择了subscription后才能选择group
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
              select
              label="Name"
              value={name}
              onChange={handleInputChange('name')} // 使用通用方法
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              disabled={loading || !group}  // 只有选择了group后才能选择name
            >
              {resourceList.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
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
              disabled={loading || !name}  // 只有选择了name后才能输入quantity
            >
            </TextField>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" sx={{ mx: 1,textTransform: "none"  }} disabled={loading}>
          Submit
          </Button>
          <Button type="button" variant="outlined" color="secondary" onClick={handleCancel} sx={{ mx: 1,textTransform: "none"  }} disabled={loading}>
            Cancel
          </Button>
        </Box>
      </form>
      {loading && (
        <Overlay>
          <LoadingComponent message='Submitting, please wait...' />
        </Overlay>
      )}
    </Box>
  );
};

export default InsertPage;
