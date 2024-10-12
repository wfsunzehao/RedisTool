import React, { useState } from 'react';
import { Paper, Box, Divider, Button, List, ListItem, ListItemText, FormControl, InputLabel, TextField, Typography, MenuItem } from '@mui/material';
import { subscriptionList } from './constants';
import agent from '../../app/api/agent';
import { DataModel } from '../../common/models/DataModel';

const CreatePage: React.FC = () => {
  const leftPanelWidth = 15; // 左边区域占15%
  const rightPanelWidth = 85; // 右边区域占85%

  const [subscription, setSubscription] = useState('');
  const [group, setGroup] = useState('');
  const [name, setName] = useState(''); // 用于 BVT 的 name
  const [quantity, setQuantity] = useState(''); // 用于 MAN 的数量
  const [time, setTime] = useState(''); // 用于 PERF 的时间
  const [selectedForm, setSelectedForm] = useState('bvt'); // 将初始值设为 'bvt'

  const [groupList,setGroupList] = useState<string[]>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();//组织浏览器自动刷新(阻止浏览器执行与某个事件相关的默认行为)
    
    console.log('Submitted:', { subscription, group, name, quantity, time });
    // 提交逻辑
    const data: DataModel = {
      name,
      region: 'EUS', // 这里替换为实际的region值
      subscription,
      group,
      // 添加其他字段的值
    };
    agent.Create.sendJson(data)
    .then(response => { console.log(response)})
    .catch(error => console.log(error.response))

  };

  const handleCancel = () => {
    setSubscription('');
    setGroup('');
    setName('');
    setQuantity('');
    setTime('');
  };

  // 处理列表项点击事件
  const handleListItemClick = (formName: string) => {
    setSelectedForm(formName);
    // 重置输入框，当选择不同表单时
    setSubscription('');
    setGroup('');
    setName('');
    setQuantity('');
    setTime('');
  };

  const handleSubChange=(subscriptionid:string)=>{
    setSubscription(subscriptionid);
    agent.Create.getGroup(subscriptionid)
    .then(response => { setGroupList(response);})
    .catch(error => console.log(error.response))
  }

  return (
    <Paper elevation={10} sx={{ height: '90vh', display: 'flex', overflow: 'hidden' }}>
      {/* 左边区域 */}
      <Box sx={{ width: `${leftPanelWidth}%`, height: '100%', overflow: 'auto' }}>
        <Paper sx={{ height: '100%', p: 2,display: 'flex', flexDirection: 'column', alignItems: 'center' }} elevation={0}>
          <List>
            <ListItem button onClick={() => handleListItemClick('bvt')}>
              <ListItemText primary="BVT" />
            </ListItem>
            <ListItem button onClick={() => handleListItemClick('man')}>
              <ListItemText primary="MAN" />
            </ListItem>
            <ListItem button onClick={() => handleListItemClick('perf')}>
              <ListItemText primary="PERF" />
            </ListItem>
          </List>
        </Paper>
      </Box>

      {/* 透明的分隔线 */}
      <Divider
        orientation="vertical"
        flexItem
        sx={{ bgcolor: 'transparent', width: '1px', mx: 1 }}
      />

      {/* 右边区域 */}
      <Box sx={{ width: `${rightPanelWidth}%`, height: '100%', overflow: 'auto' }}>
        <Paper sx={{ width: '100%', height: '100%', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} elevation={0}>
          <Paper  elevation={0} sx={{height: '100%',marginTop:1, display: 'flex', flexDirection: 'column', alignItems: 'center',paddingRight:30}}>
              <Typography variant="body1" color="warning.main">
                   注意事项：请确保填写的信息准确无误。
              </Typography>
              
 
            {selectedForm && <p style={{ color: '#1976d2', fontSize: '30px' }}>创建：{selectedForm.toUpperCase()} Cache</p>}
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
                  <TextField
                    select
                    label={`订阅`}
                    value={subscription}
                    onChange={(e)=>handleSubChange(e.target.value)}
                    variant="outlined"
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
                    onChange={(e) => setGroup(e.target.value)}
                    variant="outlined"
                    fullWidth
                  >
                    {groupList.map((item) => (
                    <MenuItem key={item} value={item}>
                        {item}
                    </MenuItem>
                ))}

                  </TextField>
                </FormControl>

                {/* {selectedForm === 'bvt' && (
                  <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
                    <TextField
                      label="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  </FormControl>
                )}

                {selectedForm === 'man' && (
                  <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
                    <TextField
                      label="数量"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  </FormControl>
                )}

                {selectedForm === 'perf' && (
                  <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
                    <TextField
                      label="时间"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  </FormControl>
                )} */}
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

          </Paper>
          
        </Paper>
      </Box>
    </Paper>
  );
};

export default CreatePage;