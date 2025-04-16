import React, { useEffect, useState } from 'react';
import {
    Typography, Box, Grid, TextField, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Backdrop, CircularProgress, Alert,
    FormControl, Autocomplete, Snackbar
} from '@mui/material';
import { Card, CardContent } from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import CircleIcon from '@mui/icons-material/Circle';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import agent from '@/app/api/agent';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { handleGenericSubmit } from '@/app/util/util'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Fade from '@mui/material/Fade';





const vmList = [
    { name: 'P1,P2', status: 'on' },
    { name: 'P3,P4', status: 'on' },
    { name: 'P5', status: 'on' },
    { name: 'SC0,C1', status: 'on' },
    { name: 'SC2,C3', status: 'on' },
    { name: 'SC4,C5,C6', status: 'on' },
    { name: 'BC0,C1', status: 'on' },
    { name: 'BC3,C4', status: 'on' },
    { name: 'BC4,C5,C6', status: 'off' },
];

const tableData = [
    {
        cacheName: 'Premium',
        testType: 'SSL',
        command: 'Get',
        clients: 64,
        threads: 16,
        requests: '1M',
        size: 1024,
        pipeline: 20,
    },
    {
        cacheName: 'Standard',
        testType: 'SSL',
        command: 'Get',
        clients: 32,
        threads: 16,
        requests: '1M',
        size: 1024,
        pipeline: 10,
    },
    {
        cacheName: 'Basic',
        testType: 'SSL',
        command: 'Get',
        clients: 16,
        threads: 16,
        requests: '1M',
        size: 1024,
        pipeline: 10,
    },
];

const CustomTooltip = styled(({ className, ...props }: any) => (
    <Tooltip
        {...props}
        arrow
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
        placement="top"
        classes={{ popper: className }}
    />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        color: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: '13px',
        maxWidth: 240,
        lineHeight: 1.6,
        transition: 'all 0.3s ease',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: 'rgba(50, 50, 50, 0.9)',
    },
}));



const Routine = () => {
    const [cacheDate, setCacheDate] = useState('');
    const [group, setGroup] = useState('');
    const [groupList, setGroupList] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [subscription, setSubscription] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Snackbar 状态
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        setSubscription('1e57c478-0901-4c02-8d35-49db234b78d2');
        agent.Create.getGroup('1e57c478-0901-4c02-8d35-49db234b78d2')
            .then((response) => {
                const sortedResponse = response.sort(
                    (a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase())
                );
                setGroupList(sortedResponse);
            })
            .catch((error) => {
                console.log(error.response);
                showSnackbar('Failed to load the Group list', 'error');
            });
    }, []);

    const handleInsertGroup = (event: React.FormEvent) => {
        if (!group) {
            showSnackbar("Please select a Group first!", "warning");
            return;
        }
    
        const data = { subscription, group };
    
        handleGenericSubmit(
            event,
            data,
            async (d) => {
                await agent.Create.InsertQCommandByGroupNameJson(JSON.stringify(d.group));
                return d;
            },
            () => true, // 提前手动校验了，这里直接返回 true
            setLoading,
            "Are you sure you want to insert the cache from this group into the queue?"
        );
    };
    
    
    const handleRunTasks = (event: React.FormEvent) => {
        const data = { subscription, group };
    
        handleGenericSubmit(
            event,
            data,
            async (d) => {
                agent.Create.executetasksJson();
                return d;
            },
            () => true, 
            setLoading,
            "Are you sure you want to start the Routine Test? This will initiate task execution."
        );
    };
    
    const handleFetchResult = (event: React.FormEvent) => {
        if (!selectedDate) {
            showSnackbar("Please select a Date first!", "warning");
            return;
        }
    
        const data = { selectedDate };
    
        handleGenericSubmit(
            event,
            data,
            async (d) => {
                const newDate = new Date(d.selectedDate!);
                newDate.setDate(newDate.getDate() + 1);
                await agent.Create.FinalDataTestJson(newDate);
                return d;
            },
            () => true,
            setLoading,
            "Are you sure you want to collect cache test results for the selected date?"
        );
    };
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCacheDate(event.target.value);
    };

    const fetchAndDownloadTxt = async () => {
        if (!cacheDate) {
            showSnackbar("Please enter Cache Date!", "warning");
            return;
        }

        try {
            const response = await agent.Create.GetBenchmarkDataBlob(cacheDate, {
                responseType: 'blob',  // 在这里设置 responseType 为 blob
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `BenchmarkData_${cacheDate}.txt`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showSnackbar("Download success!", "success");
        } catch (error) {
            console.error("Error downloading the file:", error);
            showSnackbar("Download failed, please check whether the service is running properly!", "error");
        }
    };

    return (
        <React.Fragment>
            <Box textAlign="center">
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
                    Routine Test
                </Typography>
                <Grid container spacing={3} justifyContent="center" mt={2}>
                    {vmList.map((vm) => (
                        <Grid item xs={4} key={vm.name}>
                            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                <ComputerIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                                <Typography variant="h6">{vm.name}</Typography>
                                <CircleIcon sx={{ fontSize: 20, color: vm.status === 'on' ? 'green' : 'red' }} />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box mt={5} display="flex" justifyContent="flex-start" width="50vw" sx={{ marginLeft: '-50px', overflowX: 'auto' }}>
                <TableContainer component={Paper} sx={{ width: '90%', maxWidth: 1200, borderRadius: '0px', boxShadow: 3 }}>
                    <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold', borderBottom: '2px solid #1976d2', textAlign: 'center' }}>
                        Cache SKU Test configuration
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Cache SKU</TableCell>
                                <TableCell>Test Type</TableCell>
                                <TableCell>Command</TableCell>
                                <TableCell>Clients</TableCell>
                                <TableCell>Threads</TableCell>
                                <TableCell>Requests</TableCell>
                                <TableCell>Size (bytes)</TableCell>
                                <TableCell>Pipeline</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.cacheName}</TableCell>
                                    <TableCell>{row.testType}</TableCell>
                                    <TableCell>{row.command}</TableCell>
                                    <TableCell>{row.clients}</TableCell>
                                    <TableCell>{row.threads}</TableCell>
                                    <TableCell>{row.requests}</TableCell>
                                    <TableCell>{row.size}</TableCell>
                                    <TableCell>{row.pipeline}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, gap: 3 }}>
                <Box sx={{ width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            Select Group:
                        </Typography>
                        <FormControl variant="outlined" sx={{ width: 250 }}>
                            <Autocomplete
                                options={groupList}
                                value={group}
                                onChange={(_event, newValue) => {
                                    setGroup(newValue || '');
                                    setErrors((prevErrors) => ({ ...prevErrors, group: '' }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Group"
                                        variant="outlined"
                                        error={!!errors.group}
                                        helperText={errors.group}
                                    />
                                )}
                            />
                        </FormControl>
                    </Box>

                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            Select Date:
                        </Typography>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="Pp"
                            placeholderText="Select a date"
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'space-between' }}>
                    <CustomTooltip
                        title={<Typography variant="body2">The cache from the currently selected Group is inserted into the Benchmark Test queue and is waiting to be tested</Typography>}
                    >
                        <Button
                            variant="contained"
                            sx={{
                                width: '30%',
                                borderRadius: '10px',
                                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                color: '#fff',
                                fontWeight: 600,
                                boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1565c0, #2196f3)',
                                    boxShadow: '0 5px 15px rgba(33, 150, 243, 0.4)',
                                    transform: 'translateY(-1px)',
                                },
                            }}
                            onClick={(e) => handleInsertGroup(e)}
                        >
                            Insert
                        </Button>
                    </CustomTooltip>

                    <CustomTooltip
                        title={<Typography variant="body2">Start the Benchmark Test task to test the cache in the Benchmark test queue</Typography>}
                    >
                        <Button
                            variant="contained"
                            sx={{
                                width: '30%',
                                borderRadius: '10px',
                                background: 'linear-gradient(45deg, #8e24aa, #d81b60)',
                                color: '#fff',
                                fontWeight: 600,
                                boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #6a1b9a, #c2185b)',
                                    boxShadow: '0 5px 15px rgba(216, 27, 96, 0.4)',
                                    transform: 'translateY(-1px)',
                                },
                            }}
                            onClick={(e) => handleRunTasks(e)}
                        >
                            Run
                        </Button>
                    </CustomTooltip>

                    <CustomTooltip
                        title={<Typography variant="body2">Gets test results for the selected date</Typography>}
                    >
                        <Button
                            variant="contained"
                            sx={{
                                width: '30%',
                                borderRadius: '10px',
                                background: 'linear-gradient(45deg, #388e3c, #66bb6a)',
                                color: '#fff',
                                fontWeight: 600,
                                boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #2e7d32, #43a047)',
                                    boxShadow: '0 5px 15px rgba(102, 187, 106, 0.4)',
                                    transform: 'translateY(-1px)',
                                },
                            }}
                            onClick={(e) => handleFetchResult(e)}
                        >
                            Result
                        </Button>
                    </CustomTooltip>
                </Box>
            </Box>
                <Box sx={{ width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            Select Cache:
                        </Typography>
                        <TextField
                            id="Get_data"
                            label="Date format：MMDD"
                            variant="outlined"
                            value={cacheDate}
                            onChange={handleInputChange}
                            sx={{ width: 250 }}
                        />
                    </Box>
                        <Tooltip 
                            title={
                                <span style={{ fontSize: '1rem', fontWeight: 300 }}>
                                    Click to download the Benchmark test results for the specified date
                                </span>
                            }
                            arrow 
                            TransitionComponent={Fade} 
                            TransitionProps={{ timeout: 300 }} 
                            placement="top"
                        >
                            <Button
                                variant="contained"
                                onClick={fetchAndDownloadTxt}
                                sx={{
                                    width: '100%',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #1976d2, #9c27b0)',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #1565c0, #7b1fa2)',
                                        transform: 'scale(1.03)',
                                        boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
                                    },
                                }}
                            >
                                Download esults
                            </Button>
                    </Tooltip>
                </Box>
            </Box>

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* Snackbar 弹出提示框 */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
};

export default Routine;
