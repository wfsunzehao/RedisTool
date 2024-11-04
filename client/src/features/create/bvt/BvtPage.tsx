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
  styled
} from '@mui/material';
import swal from 'sweetalert';
import agent from '../../../app/api/agent';
import { DataModel } from '../../../common/models/DataModel';
import { BVTTestCaseNames, Overlay,subscriptionList } from '../../../common/constants/constants';
import LoadingComponent from '../../../common/components/CustomLoading';
import { handleGenericSubmit } from '../../../app/util/util';


const BvtPage: React.FC = () => {
  const [subscription, setSubscription] = useState('');
  const [group, setGroup] = useState('');
  const [name, setName] = useState('');  
  const [region, setRegion] = useState(''); // 用于 BVT 的 region
  const [quantity, setQuantity] = useState(''); // 数量

  const [selectedNames, setSelectedNames] = useState<string[]>([]); // 用于复选框的选中状态
  const [option, setOption] = useState('all'); // 新增状态用于单选框
  const [loading, setLoading] = useState(false);
  const [groupList,setGroupList] = useState<string[]>([]);
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
    if (option === 'case' && selectedNames.length === 0) newErrors.selectedNames = "至少选择一个名称"; // 校验
    if (option === 'case' && selectedNames.length === 1 && quantity.trim() === '') {
      newErrors.quantity = "数量不能为空"; // 仅在选择一个时校验数量
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // 返回是否有错误
  };


  const apiPathFunction = async (data: DataModel) => {
    const apiPath = option === 'case' ? agent.Create.sendOneBvtJson : agent.Create.sendAllBvtJson;
    return await apiPath(data); // 调用选中的 API 路径
};
  const handleSubmit = (event: React.FormEvent) => {
      // 提交逻辑
      const data: DataModel = {
        name,
        region: 'Central US EUAP', // 这里替换为实际的region值
        subscription,
        group,
        port: '6379',
        ...(option === 'case' && {
          cases: selectedNames,
          ...(selectedNames.length === 1 && { quantity: quantity}), // 仅在选择一个case时添加数量
        }),
        // 添加其他字段的值
      };    
        handleGenericSubmit(event, data, apiPathFunction, CheckForm, setLoading); 
  };
  // 处理取消按钮点击事件
  const handleCancel = () => {
    setSubscription('');
    setGroup('');
    setSelectedNames([]); // 清除选中的名称
    setQuantity(''); // 清除数量
    setErrors({});
  };
  // 处理下拉框改变事件
  const handleSubChange=(subscriptionid:string)=>{
    setSubscription(subscriptionid);
    setErrors(prevErrors => ({ ...prevErrors, subscription: '' })); // 清除订阅错误
    agent.Create.getGroup(subscriptionid)
    .then(response => { setGroupList(response);})
    .catch(error => console.log(error.response))
  }
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
  // 处理复选框选择
  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setSelectedNames(value);
    if (value.length > 0) {
      setErrors(prevErrors => ({ ...prevErrors, selectedNames: '' }));
    }
  };

  return (
          <Box>
            <Alert severity="info" sx={{width: '600px',margin: '0 auto'}}>
                  Currently, PrivateEndpointBladeTest, CacheCreationTest, and EnterpriseTest
                  need to be manually verified and created, and are not included in this feature. 
            </Alert>
            <p style={{ color: '#1976d2', fontSize: '30px',textAlign: 'center'  }}>创建： BVT Cache</p>
            <form className="submit-box" onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
                  <TextField
                    select
                    label={`订阅`}
                    value={subscription}
                    onChange={(e)=>handleSubChange(e.target.value)}
                    variant="outlined"
                    error={!!errors.subscription} // 判断是否有错误
                    helperText={errors.subscription} // 显示错误信息
                    fullWidth
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
                    error={!!errors.group} // 判断是否有错误
                    helperText={errors.group} // 显示错误信息
                    fullWidth
                  >
                    {groupList.map((item) => (
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
                    <FormControlLabel value="case" control={<Radio />} label="Case" />
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
                  {BVTTestCaseNames.map((name) => (
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

              <Alert sx={{ mt: 2 }} severity="warning">请谨慎操作 , 提交后会创建cache</Alert>
              </Box>

              
              {/* 其他相关表单字段 */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
               
                <Button type="submit" variant="contained" color="primary" sx={{ mx: 1 }}>
                  提交
                </Button>
                <Button type="button" variant="outlined" color="secondary" onClick={handleCancel} sx={{ mx: 1 }}>
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

export default BvtPage;