import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import swal from 'sweetalert';
import agent from '../../../app/api/agent';
import { ManModel } from '../../../common/models/DataModel';
import { ManualTestCaseNames,Overlay, subscriptionList } from '../../../common/constants/constants';
import LoadingComponent from '../../../common/components/CustomLoading';
import { useMessage } from '../../../app/context/MessageContext';
import { handleGenericSubmit } from '../../../app/util/util';



const ManPage: React.FC = () => {
  const [subscription, setSubscription] = useState('');
  const [group, setGroup] = useState('');
  // const [name, setName] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState(""); // 用于 BVT 的 region
  const [groupList, setGroupList] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]); // 用于复选框的选中状态
  const [option, setOption] = useState('all'); // 新增状态用于单选框
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(''); // 数量
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
    if (!region) newErrors.region = "区域不能为空";
    if (option === 'case' && selectedNames.length === 0) newErrors.selectedNames = "至少选择一个名称"; // 校验
    if (option === 'case' && selectedNames.length === 1 && quantity.trim() === '') {
      newErrors.quantity = "数量不能为空"; // 仅在选择一个时校验数量
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // 返回是否有错误
  };

  const apiPathFunction = async (data: ManModel) => {
    return await agent.Create.sendManJson(data); // 或其他 API 调用
  };
  const handleSubmit = (event: React.FormEvent) => {
      // 提交逻辑
        const data: ManModel = {
          
          region: region, // 这里替换为实际的region值
          subscription,
          group,
          // ...(option === 'case' && {
          //   cases: selectedNames,
          //   ...(selectedNames.length === 1 && { quantity: quantity}), // 仅在选择一个case时添加数量
          // }),
          // 添加其他字段的值
        };
        const customMessage = "Once started, the cache used in MAN will be created!";     
        handleGenericSubmit(event, data, apiPathFunction, CheckForm, setLoading,customMessage); 
  };
  // 处理取消按钮点击事件
  const handleCancel = () => {
    setSubscription('');
    setGroup('');
    setRegion('');
    setSelectedNames([]); // 清除选中的名称
    setQuantity(''); // 清除数量
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
    // 处理复选框选择
    const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
      const value = event.target.value as string[];
      setSelectedNames(value);
      if (value.length > 0) {
        setErrors(prevErrors => ({ ...prevErrors, selectedNames: '' }));
      }
    };
    const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
  
      switch (field) {
        case 'group':
          setGroup(value);
          setErrors(prevErrors => ({ ...prevErrors, group: '' })); // 清除组错误
          break;
        // case 'name':
        //   setName(value);
        //   setErrors(prevErrors => ({ ...prevErrors, name: '' })); // 清除名称错误
        //   break;
        case 'quantity':
          setQuantity(value);
          setErrors(prevErrors => ({ ...prevErrors, quantity: '' })); // 清除数量错误
          break;
        case 'region':
          setRegion(value);
          setErrors(prevErrors => ({ ...prevErrors, region: '' })); // 清除地区错误
          break;
        default:
          break;
      }
    };

  return (
    <Box>
      <p style={{ color: '#1976d2', fontSize: '30px', textAlign: 'center' }}>Create：Man Cache</p>
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
          <FormControl variant="outlined" sx={{ width: "100%", marginTop: 2 }}>
            <TextField
              select
              label="Region"
              value={region}
              onChange={handleInputChange('region')}
              variant="outlined"
              error={!!errors.region} // 判断是否有错误
              helperText={errors.region} // 显示错误信息
              fullWidth
            >
              {["East US 2 EUAP","Central US EUAP","East US"].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          {/* 添加单选框 */}
          <FormControl component="fieldset" sx={{ marginTop: 2 }}>
            <RadioGroup row value={option} onChange={(e) => setOption(e.target.value)}>
            <FormControlLabel value="all" control={<Radio />} label="All" />
            {/* <FormControlLabel value="case" control={<Radio />} label="Case" /> */}
            </RadioGroup>
          </FormControl>
           {/* 当选择 case 时显示复选框 */}
                {/* 下拉框与复选框结合 */}
                {option === 'case' && (
            <>
              <FormControl
                variant="outlined"
                sx={{ width: '100%', marginTop: 2 }}
                error={!!errors.selectedNames}
              >
                <InputLabel id="names-label">Case</InputLabel>
                <Select
                  labelId="names-label"
                  multiple
                  value={selectedNames}
                  onChange={handleSelectChange}
                  input={<OutlinedInput label="Case" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {ManualTestCaseNames.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={selectedNames.includes(name)} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
                {errors.selectedNames && (
                  <FormHelperText error>{errors.selectedNames}</FormHelperText>
                )}
              </FormControl>
              {selectedNames.length === 1 && (
                <TextField
                  label="数量"
                  type="number"
                  value={quantity}
                  onChange={handleInputChange('quantity')}
                  variant="outlined"
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                  sx={{ width: '100%', marginTop: 2 }}
                />
              )}
            </>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" sx={{ mx: 1 }} disabled={loading}>
           submit
          </Button>
          <Button type="button" variant="outlined" color="secondary" onClick={handleCancel} sx={{ mx: 1 }} disabled={loading}>
            cancel
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
