import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import agent from "../../app/api/agent";
import { useState } from "react";

export default function AboutPage() {
  const[ValidationError, setValidationError] = useState<string[]>([]);

  function getValidationError(){
    agent.TestErrors.getValidationError()
    .then(()=>console.log('Validation Error'))
    .catch(error=>setValidationError(error));
  }


  return(
    <Container>
      <Typography variant="h2">Error Test</Typography>
      <ButtonGroup fullWidth>
        <Button variant='contained' onClick={()=>agent.TestErrors.get404Error().catch((error)=>console.log(error))}>Get 404</Button>
        <Button variant='contained' onClick={()=>agent.TestErrors.get400Error().catch((error)=>console.log(error))}>Get 400</Button>
        <Button variant='contained' onClick={()=>agent.TestErrors.get500Error().catch((error)=>console.log(error))}>Get 500</Button>
        <Button variant='contained' onClick={()=>agent.TestErrors.get401Error().catch((error)=>console.log(error))}>Get 401</Button>
        <Button variant='contained' onClick={getValidationError}>Get Validation Error</Button>
      </ButtonGroup>
      {ValidationError.length>0 && 
          <Alert severity="error">
            <AlertTitle>Validation Error</AlertTitle>
            <List>
                {ValidationError.map(error=>(
                  <ListItem key={error}>
                        <ListItemText>{error}</ListItemText>
                  </ListItem>
                ))}
            </List>
          </Alert>}
    </Container>
  )
}

