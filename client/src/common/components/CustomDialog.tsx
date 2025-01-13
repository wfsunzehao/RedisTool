import { CheckCircleOutline } from '@mui/icons-material'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material'

interface DialogComponentProps {
    openDialog: boolean
    nextTime: string
    handleDiaClose: () => void
    setNextTime: (nextTime: string) => void
    handleConfirm: () => void
}

export default function DialogComponent({
    openDialog,
    nextTime,
    handleDiaClose,
    setNextTime,
    handleConfirm,
}: DialogComponentProps) {
    return (
        <Dialog open={openDialog} onClose={handleDiaClose}>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ fontSize: '1.3rem' }}>
                    A cache will be created for BVT testing
                </DialogContentText>
                <RadioGroup value={nextTime} onChange={(e) => setNextTime(e.target.value)}>
                    <FormControlLabel value="yes" control={<Radio />} label="Don't prompt next time" />
                    {/* <FormControlLabel value="no" control={<Radio />} label="Continue prompting" /> */}
                </RadioGroup>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center' }}>
                <Button size="large" onClick={handleDiaClose} color="primary" startIcon={<CheckCircleOutline />}>
                    Cancel
                </Button>
                <Button size="large" onClick={handleConfirm} color="primary" startIcon={<CheckCircleOutline />}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

// Example usage:
// const [openDialog, setOpenDialog] = useState(false);
// const [nextTime, setNextTime] = useState('no');
// const handleDiaClose = () => {
//     setOpenDialog(false);
// }
// const handleConfirm = () => {
//     setOpenDialog(false);
// }
// <DialogComponent
//     openDialog={openDialog}
//     nextTime={nextTime}
//     handleDiaClose={handleDiaClose}
//     setNextTime={setNextTime}
//     handleConfirm={handleConfirm}
///>
