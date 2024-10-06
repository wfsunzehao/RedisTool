import React from "react";
import { Container, Typography, Grid, Card, CardContent, Button, Box, ButtonGroup } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrement, increment } from "./counterSlice";

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const{data,title}=useAppSelector((state) => state.counter);

  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <Typography
        variant="h2"
        component="h1"
        sx={{ textAlign: 'center', marginBottom: 4, color: 'primary.main' }}
      >
        {title}
        {data}
      </Typography>
      <ButtonGroup sx={{position: 'absolute', top: 400, left: '50%', transform: 'translateX(-50%)'}}>
        <Button variant="contained" color="error" onClick={() => dispatch(decrement(1))}>Decrement</Button>
        <Button variant="contained" color="success" onClick={() => dispatch(increment(1))}>Increment</Button>
        <Button variant="contained" color="primary" onClick={() => dispatch(increment(5))}>Decrement</Button>
      </ButtonGroup>

      <Grid container spacing={4}>
        {/* Card 1 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Compute
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                Scale your applications and services with powerful computing resources.
              </Typography>
              <Button variant="contained" color="primary" size="small">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Storage
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                Securely store and manage data with reliable cloud storage solutions.
              </Typography>
              <Button variant="contained" color="primary" size="small">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
            <CardContent>
              <Typography variant="h5" component="div">
                AI & Machine Learning
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                Build and deploy intelligent applications using advanced AI tools.
              </Typography>
              <Button variant="contained" color="primary" size="small">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', marginTop: 8 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          size="large"
          sx={{ padding: '12px 24px', fontWeight: 'bold' }}
          onClick={() => alert('Get Started Clicked!')}
        >
          Get Started with Azure
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;