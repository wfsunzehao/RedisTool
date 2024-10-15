import { CheckCircleOutline } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Radio, RadioGroup } from "@mui/material";
interface DialogComponentProps {
    openDialog: boolean,
    nextTime: string,
    handleDiaClose: () => void,
    setNextTime:(nextTime:string)=>void,
    handleConfirm: () => void
}

export default function DialogComponent({openDialog,nextTime, handleDiaClose,setNextTime,handleConfirm}: DialogComponentProps) {
  
  return(
    <Dialog open={openDialog} onClose={handleDiaClose}>
        <DialogTitle>确认提交</DialogTitle>
        <DialogContent>
            <DialogContentText sx={{fontSize: '1.3rem'}}>
              即将创建用于BVT测试的Cache
            </DialogContentText>
            <RadioGroup
              value={nextTime}
              onChange={(e) => setNextTime(e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="下次不提示" />
              {/* <FormControlLabel value="no" control={<Radio />} label="继续提示" /> */}
            </RadioGroup>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
            <Button size='large' onClick={handleDiaClose} color="primary" startIcon={<CheckCircleOutline />}>
              取消
            </Button>
            <Button size='large' onClick={handleConfirm} color="primary" startIcon={<CheckCircleOutline />}>
              确认
            </Button>
          </DialogActions>
    </Dialog>
  )
}
//使用方法如下
// const [openDialog, setOpenDialog] = useState(false);
// const [nextTime, setNextTime] = useState('no'); 
// const handleDiaClose=()=>{
//     setOpenDialog(false);
//   }
//   const handleConfirm=()=>{
//     
//     setOpenDialog(false);}

{/* <DialogComponent 
          openDialog={openDialog} 
          nextTime={nextTime}
          handleDiaClose={handleDiaClose}
          setNextTime={setNextTime}
          handleConfirm={handleConfirm}/>
          
    </Container> */}
