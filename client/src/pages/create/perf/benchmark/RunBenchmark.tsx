import React from 'react'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import LoadingComponent from '@/common/components/CustomLoading'
import { Overlay } from '@/common/constants/constants'
import agent from '@/app/api/agent'
import axios from 'axios'

const RunBenchmark = () => {
    const [name, setname] = React.useState('')
    const [region, setregion] = React.useState('East US 2 EUAP')
    const [description, setdescription] = React.useState('')
    const [primary, setprimary] = React.useState('')
    const [clients, setclients] = React.useState('')
    const [size, setsize] = React.useState('')
    const [requests, setrequests] = React.useState('')
    const [times, settimes] = React.useState('10')
    const [pipeline, setpipeline] = React.useState('')
    const [threads, setthreads] = React.useState('')
    const navigate = useNavigate()
    const [loading, setLoading] = React.useState(false)

    const handleChange = (event: SelectChangeEvent) => {
        setregion(event.target.value as string)
    }

    // 生成时间戳
    const generateTimeStamp = () => {
        const now = new Date();
        return now.toISOString().replace(/[-:.TZ]/g, '');
    };

    const handleSubmit = async () => {
        if (!name || !primary || !clients || !size || !requests || !threads) {
            alert('Please fill out all required fields.');
            return;
          }

        setLoading(true);
        const timeStamp = generateTimeStamp();

        const body = {
            name,
            primary,
            region,
            description,
            clients,
            threads,
            size,
            requests,
            pipeline,
            times,
            timeStamp
        }
    
        try {
            const response = await agent.Create.sendBenchmarkRunJson(body)
            console.log('Submission successful:', response)
            navigate('/create/Statistics');
        } catch (error) {
            console.error('Error submitting data:', error)
        }
    }

    const handleRoutine = () => {
        //常规做法
    }



    return (
        <div>
            <Container maxWidth="xl">
                <Typography
                    variant="h3"
                    gutterBottom
                    align="center"
                    sx={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '30px',
                    }}
                >
                    Run Test
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', height: '60vh', overflowY: 'auto' }}>
                    <Box
                        sx={{
                            flex: '0 0 50%',
                            //maxHeight: '90vh',
                            overflowY: 'auto',
                            paddingRight: '16px',
                        }}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <InputLabel>Name of the test</InputLabel>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={name}
                                    onChange={(e) => setname(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Primary String</InputLabel>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={primary}
                                    onChange={(e) => setprimary(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Region</InputLabel>
                                <Select fullWidth value={region} onChange={handleChange}>
                                    <MenuItem value="East US 2 EUAP">East US 2 EUAP</MenuItem>
                                    <MenuItem value="Central US EUAP">Central US EUAP</MenuItem>
                                    <MenuItem value="East US">East US</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Enter a description</InputLabel>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={description}
                                    onChange={(e) => setdescription(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormLabel>Select test type</FormLabel>
                                <RadioGroup row defaultValue="No-SSL">
                                    <FormControlLabel value="No-SSL" control={<Radio />} label="No-SSL" />
                                    <FormControlLabel value="SSL" control={<Radio />} label="SSL" />
                                </RadioGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Select test way</InputLabel>
                                <FormGroup row>
                                    <FormControlLabel control={<Checkbox />} label="Set" />
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Get" />
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box
                        sx={{
                            flex: '0 0 50%',
                            //maxHeight: '90vh',
                            overflowY: 'auto',
                            paddingLeft: '16px',
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <InputLabel>Clients (-c)</InputLabel>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={clients}
                                    onChange={(e) => setclients(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Threads</InputLabel>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={threads}
                                    onChange={(e) => setthreads(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Payload size (bytes) (-d)</InputLabel>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={size}
                                    onChange={(e) => setsize(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Number of requests (-n)</InputLabel>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={requests}
                                    onChange={(e) => setrequests(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Pipeline (-P)</InputLabel>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={pipeline}
                                    onChange={(e) => setpipeline(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Run times (-i)</InputLabel>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={times}
                                    onChange={(e) => settimes(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Box mt={3} display="flex" justifyContent="space-between">
                    <Button variant="contained" onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button variant="contained" onClick={handleRoutine}>
                        Routine
                    </Button>
                </Box>
            </Container>
        </div>
    )
}

export default RunBenchmark
