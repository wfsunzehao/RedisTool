import { Box, Container, Paper } from "@mui/material";

import {Button} from "@nextui-org/button";

export default function DeletePage() {
  return (
    <Container sx={{marginTop: '20px'}}>
      <Paper elevation={10} sx={{ height: '100vh', display: 'flex', overflow: 'hidden',border: '1px solid #ccc' }} >
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
  );
}
