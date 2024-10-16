import { Container, Paper, Button } from "@mui/material";

export default function OtherPage() {
    return(
      <Container sx={{marginTop: '20px'}}>
      <Paper elevation={10} sx={{ height: '90vh', display: 'flex', overflow: 'hidden',border: '1px solid #ccc' }} >
          <div>
          <Button color="primary" >
            Button1
          </Button>
          <Button color="primary" >
            Button2
          </Button>
          </div>
      </Paper>  
    </Container>
    )
  }