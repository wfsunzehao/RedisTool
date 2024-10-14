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
            <DialogContentText>
              确认提交吗？是否下次不再提示？
            </DialogContentText>
            <RadioGroup
              value={nextTime}
              onChange={(e) => setNextTime(e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="下次不提示" />
              <FormControlLabel value="no" control={<Radio />} label="继续提示" />
            </RadioGroup>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
            <Button onClick={handleDiaClose} color="primary" startIcon={<CheckCircleOutline />}>
              取消
            </Button>
            <Button onClick={handleConfirm} color="primary" startIcon={<CheckCircleOutline />}>
              确认
            </Button>
          </DialogActions>
    </Dialog>
  )
}