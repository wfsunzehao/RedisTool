import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  TextField,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import agent from '../../../app/api/agent';
import { ManModel } from '../../../common/models/DataModel';
import { useMessage } from '../../../app/context/MessageContext';
import { handleGenericSubmit } from '../../../app/util/util';

const ManPage: React.FC = () => {
  const [subscription, setSubscription] = useState('');
  const [group, setGroup] = useState('');
  const [region, setRegion] = useState('');
  const [groupList, setGroupList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { addMessage } = useMessage();

  // 初始化加载
  useEffect(() => {
    setSubscription("1e57c478-0901-4c02-8d35-49db234b78d2");
    fetchGroupList("1e57c478-0901-4c02-8d35-49db234b78d2");
  }, []);

  // 获取组列表
  const fetchGroupList = (subscriptionId: string) => {
    agent.Create.getGroup(subscriptionId)
      .then((response) => {
        const sortedResponse = response.sort((a: string, b: string) =>
          a.toLowerCase().localeCompare(b.toLowerCase()) // 忽略大小写排序
        );
        setGroupList(sortedResponse);
      })
      .catch((error) => console.error(error));
  };

  // 表单校验
  const checkForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!subscription) newErrors.subscription = '订阅不能为空';
    if (!group) newErrors.group = '组不能为空';
    if (!region) newErrors.region = '区域不能为空';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交处理
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!checkForm()) return;

    const data: ManModel = { region, subscription, group };
    const customMessage = 'Once started, the cache used in MAN will be created!';
    handleGenericSubmit(event, data, () => agent.Create.sendManJson(data), checkForm, setLoading, customMessage);
  };

  return (
    <Box>
      <p style={{ color: '#1976d2', fontSize: '30px', textAlign: 'center' }}>
        Create：Manual Cache
      </p>
      <form className="submit-box" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
            <TextField
              select
              label="Subscription"
              value={subscription}
              onChange={(e) => setSubscription(e.target.value)}
              error={!!errors.subscription}
              helperText={errors.subscription}
              fullWidth
            >
              {[{
                value: '1e57c478-0901-4c02-8d35-49db234b78d2',
                label: 'Cache Team - Vendor CTI Testing 2',
              }].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <FormControl sx={{ width: '100%', marginTop: 2 }}>
            <Autocomplete
              freeSolo={false} // 禁止自定义输入
              options={groupList}
              value={group}
              onChange={(e, newValue) => setGroup(newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Group"
                  variant="outlined"
                  error={!!errors.group}
                  helperText={errors.group}
                />
              )}
            />
          </FormControl>

          <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
            <TextField
              select
              label="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              error={!!errors.region}
              helperText={errors.region}
              fullWidth
            >
              {['East US 2 EUAP', 'Central US EUAP', 'East US'].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mx: 1,textTransform: 'none'  }}
            >
              Submit
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              disabled={loading}
              onClick={() => {
                setSubscription('');
                setGroup('');
                setRegion('');
                setErrors({});
              }}
              sx={{ mx: 1,textTransform: 'none'  }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </form>
      {loading && (
        <Box sx={{ mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default ManPage;
