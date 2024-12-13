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
import LoadingComponent from '../../../common/components/CustomLoading';
import { useMessage } from '../../../app/context/MessageContext';
import { handleGenericSubmit } from '../../../app/util/util';

const ManPage: React.FC = () => {
  const [subscription, setSubscription] = useState('');
  const [group, setGroup] = useState('');
  const [region, setRegion] = useState('');
  const [groupList, setGroupList] = useState<string[]>([]);
  const [filteredGroupList, setFilteredGroupList] = useState<string[]>([]); // 过滤后的组列表
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { addMessage } = useMessage();

  // 初始化加载
  useEffect(() => {
    setSubscription('1e57c478-0901-4c02-8d35-49db234b78d2');
    fetchGroupList('1e57c478-0901-4c02-8d35-49db234b78d2');
  }, []);

  // 获取组列表
  const fetchGroupList = (subscriptionId: string) => {
    agent.Create.getGroup(subscriptionId)
      .then((response) => {
        setGroupList(response);
        setFilteredGroupList(response); // 初始化过滤列表
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

  // 下拉框和搜索框处理
  const handleGroupInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setFilteredGroupList(
      groupList.filter((item) => item.toLowerCase().includes(searchValue))
    );
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
              {['1e57c478-0901-4c02-8d35-49db234b78d2'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <FormControl sx={{ width: '100%', marginTop: 2 }}>
            <Autocomplete
              freeSolo
              options={filteredGroupList}
              value={group}
              onChange={(e, newValue) => setGroup(newValue || '')}
              inputValue={group}
              onInputChange={(e, value) => setGroup(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Group"
                  variant="outlined"
                  error={!!errors.group}
                  helperText={errors.group}
                  onChange={handleGroupInputChange} // 处理输入以筛选列表
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
              sx={{ mx: 1 }}
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
              sx={{ mx: 1 }}
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
