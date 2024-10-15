import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

interface Props {
    message?: string;
}

export default function LoadingComponent({message='Loading...'}: Props) {
  return(
    <Backdrop open={true} invisible={true}>
        <Box sx={{ width: '100%', height: '100h', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress size={100} color="secondary" />
            <Typography variant="h4"  sx={{  justifyContent: 'center',position:'fixed',top:'60%'}}>
                {message}
            </Typography>
        </Box>

    </Backdrop>
  )
}