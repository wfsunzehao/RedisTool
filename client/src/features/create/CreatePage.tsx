import { Box, Button, Container, createTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, FormControlLabel, List, ListItemButton, MenuItem, Paper, Radio, RadioGroup, Snackbar, TextField, ThemeProvider, Typography } from "@mui/material";
import { StyledButton, StyledListItem, StyledListItemText, StyledPaper } from "./StyledComponents";
import { subscriptionList, theme } from "./constants";
import { useEffect, useState } from "react";
import { CheckCircleOutline } from "@mui/icons-material";
import { DataModel } from "../../common/models/DataModel";
import agent from "../../app/api/agent";



const CreatePage: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState('BVT');
    const [subscription, setSubscription] = useState('');
    const [group, setGroup] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [nextTimeDontPrompt, setNextTimeDontPrompt] = useState('no'); // 使用单选框

    const [groupList,setGroupList] = useState<string[]>([]);
    const [data, setData] = useState<DataModel>();
    
    const handleSelectItem = (item: string) => {
        setSelectedItem(item);
      };

      const handleSubmit = () => {
        if (nextTimeDontPrompt === 'yes') {
          handleConfirm();
        } else {
          setOpenDialog(true);
        }


      };
    
      const handleConfirm = () => {
        setOpenSnackbar(true);
        setOpenDialog(false);
        resetFields();
      };
    
      const resetFields = () => {
        setSelectedItem('');
        setSubscription('');
        setGroup('');
      };
    
      const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
      };

      const handleSubChange=(subscriptionid:string)=>{
        setSubscription(subscriptionid);

        agent.Create.getGroup(subscriptionid)
        .then(response => { setGroupList(response);})
        .catch(error => console.log(error.response))
      }

    //   useEffect(() => {
    //     agent.Create.getGroup(Number(subscription))
    //     .then(response => { setGroupList(response);})
    //     .catch(error => console.log(error.response))
    //   },[subscription])

  return(
    <ThemeProvider theme={theme} >
        <StyledPaper elevation={3} style={{ width: '100%', marginRight: 20,height:'100%',flex:1 }}>
        <Box
            sx={{
                display: 'flex', // 让 Box 以 flex 布局展现其内容
                height: '100vh', // 设置 Box 高度为 100vh，确保填满整个视口
                position: 'relative', // 设置为相对定位，以便 Drawer 的绝对定位得以正确应用
            }}
        >
            <Container >
                
                <Drawer
                variant="permanent" // 设置抽屉的类型为永久抽屉
                sx={{
                display: { xs: 'none', sm: 'block' }, // 隐藏在小屏幕下，在大屏幕上显示
                '& .MuiDrawer-paper': { // 选择抽屉的纸张部分进行样式设置
                    height: '100%', // 使抽屉高度跟随 Box 高度
                    width: '20%', // 设定抽屉宽度为 Box 宽度的 20%
                    position: 'absolute', // 让抽屉的定位方式为绝对定位
                },
                }}
                 open // 控制抽屉的打开状态，设置为 true 则始终打开
             >
                {/* 这里可以放置具体的导航内容，例如菜单列表 */}
                <List>
                    {['BVT', 'MAN', 'PERF'].map((item) => (
                    <StyledListItem
                        button
                        key={item}
                        onClick={() => handleSelectItem(item)}
                        selected={selectedItem === item}
                    >
                        <StyledListItemText primary={<Typography variant="body1">{item}</Typography>} />
                    </StyledListItem>
                    ))}
                </List>
                </Drawer>
                {selectedItem && (
            <Box sx={{ textAlign: 'center',left:'50%'}} >
              <Typography variant="h5" gutterBottom>提交信息: <span style={{ color: '#1976d2' }}>{selectedItem}</span></Typography>
              <TextField
                select
                label="订阅"
                helperText="请选择你需要的订阅"
                value={subscription}
                onChange={(e)=>handleSubChange(e.target.value)}//(e) => setSubscription(e.target.value)
                margin="normal"
                variant="outlined"//"filled"
                InputLabelProps={{ style: { color: '#555' } }}
                inputProps={{ style: { color: '#333' } }}
                sx={{width: '300px'}}
              >
                {subscriptionList.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
               </TextField> 
              <TextField
                label="组"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ style: { color: '#555' } }}
                inputProps={{ style: { color: '#333' } }}
                sx={{width: '300px'}}
              />
              <Box marginTop={2} display="flex" justifyContent="center">
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  style={{ marginRight: 10 }}
                >
                  提交
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  onClick={resetFields}
                >
                  取消
                </StyledButton>
              </Box>
            </Box>
          )}
            </Container>
            
         </Box>
         {/* 提交确认对话框 */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>确认提交</DialogTitle>
          <DialogContent>
            <DialogContentText>
              确认提交吗？是否下次不再提示？
            </DialogContentText>
            <RadioGroup
              value={nextTimeDontPrompt}
              onChange={(e) => setNextTimeDontPrompt(e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="下次不提示" />
              <FormControlLabel value="no" control={<Radio />} label="继续提示" />
            </RadioGroup>
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center' }}>
            <Button onClick={() => setOpenDialog(false)} color="primary" startIcon={<CheckCircleOutline />}>
              取消
            </Button>
            <Button onClick={handleConfirm} color="primary" startIcon={<CheckCircleOutline />}>
              确认
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          message={`提交成功: ${selectedItem} | 订阅: ${subscription} | 组: ${group}`}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // 设置提示框位置为右下角
        />
      </StyledPaper>

      
    </ThemeProvider>
  )
}

export default CreatePage;