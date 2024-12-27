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
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
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

    const handleChange = (event: SelectChangeEvent) => {
        setregion(event.target.value as string)
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5139/api/BenchmarkRun', {
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
            })
            console.log('Submission successful:', response.data)
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
                <Typography variant="h4" gutterBottom>
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
                                <RadioGroup row defaultValue="Stress">
                                    <FormControlLabel value="Performance" control={<Radio />} label="Performance" />
                                    <FormControlLabel value="Stress" control={<Radio />} label="Stress" />
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
