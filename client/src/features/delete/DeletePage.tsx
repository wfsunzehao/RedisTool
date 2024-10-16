import { Box, Container, Paper } from "@mui/material";

import {Button} from "@nextui-org/button";

export default function DeletePage() {
  return (
    <Container sx={{marginTop: '20px'}}>
      <Paper elevation={10} sx={{ height: '90vh', display: 'flex', overflow: 'hidden',border: '1px solid #ccc' }} >
          <div>
          <Button color="primary" >
            Button
          </Button>
          </div>
      </Paper>  
    </Container>
  );
}
