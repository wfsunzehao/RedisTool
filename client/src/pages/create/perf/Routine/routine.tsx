import React, { useEffect, useState } from 'react';
import {
    Typography, Box, TextField, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Backdrop, CircularProgress, Alert,
    FormControl, Autocomplete, Snackbar
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import agent from '@/app/api/agent';
import { handleGenericSubmit } from '@/app/util/util'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Fade from '@mui/material/Fade';
import axios from 'axios';
import { Select, MenuItem, InputLabel, List, ListItem, ListItemText,ListItemIcon,Checkbox } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import ComputerIcon from '@mui/icons-material/Computer';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


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
    // ✅ 订阅与组相关状态
    const [subscription, setSubscription] = useState('');
    const [group, setGroup] = useState('');
    const [groupList, setGroupList] = useState<string[]>([]);
    const [firstSelection, setFirstSelection] = useState('fc2f20f5-602a-4ebd-97e6-4fae3f1f6424');
    const [secondSelection, setSecondSelection] = useState(""); 
    const [secondSelectionOptions, setSecondSelectionOptions] = useState<string[]>([]);
    const [vmMap, setVmMap] = useState<Record<string, string>>({});
    const [selectedVMs, setSelectedVMs] = useState<string[]>([]);
  
    // ✅ 表单与输入
    const [cacheDate, setCacheDate] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
    // ✅ 状态与提示
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
    const [loadingVMs, setLoadingVMs] = useState(false);


  
    // 🔄 初始化订阅和组列表
    useEffect(() => {
      const defaultSub = '1e57c478-0901-4c02-8d35-49db234b78d2';
      setSubscription(defaultSub);
      agent.Create.getGroup(defaultSub)
        .then((res) => {
          const sorted = res.sort((a: string, b: string) => a.localeCompare(b));
          setGroupList(sorted);
        })
        .catch((err) => {
          console.error(err);
          showSnackbar('Failed to load the Group list', 'error');
        });
    }, []);
  
    // 🔄 订阅选择变化时更新组列表
    useEffect(() => {
        if (firstSelection) {
          fetchSecondSelectionOptions(firstSelection);
          
          // 设置默认 group，并触发 VM 获取
          let defaultGroup = '';
          if (firstSelection === 'fc2f20f5-602a-4ebd-97e6-4fae3f1f6424') {
            defaultGroup = 'MemtierbenchmarkTest';
          } else if (firstSelection === '1e57c478-0901-4c02-8d35-49db234b78d2') {
            defaultGroup = 'Redis_MemtierbenchmarkTest';
          }
      
          if (defaultGroup) {
            setSecondSelection(defaultGroup);
            fetchVmList(firstSelection, defaultGroup);
          } else {
            setSecondSelection('');
            setVmMap({});
          }
        }
      }, [firstSelection]);
  
    // 🔁 获取组选项
    const fetchSecondSelectionOptions = async (subId: string) => {
      try {
        const data = await agent.Create.getGroupOptions(subId);
        setSecondSelectionOptions(data);
      } catch (err) {
        console.error('Error fetching group list:', err);
      }
    };
  
    // 🔁 处理组选择变化并获取 VM 列表
    const handleGroupSelectionChange = async (e: SelectChangeEvent) => {
        const selectedGroup = e.target.value;
        setSecondSelection(selectedGroup);
        if (firstSelection && selectedGroup) {
        await fetchVmList(firstSelection, selectedGroup);
        }
    };
      // 🔁 获取 VM 列表（VM名 => 状态）
    const fetchVmList = async (subId: string, groupName: string) => {
        try {
            setLoadingVMs(true); // 开始加载
            setSelectedVMs([]); // 清空已选
            const data = await agent.Create.getVmList(subId, groupName);
            setVmMap(data);
        } catch (err) {
            console.error('Error fetching VM list:', err);
        }finally {
            setLoadingVMs(false); // 请求结束，关闭加载动画
        }
    };

    //✅ 多选点击逻辑
    const handleVmToggle = (vmName: string) => {
        setSelectedVMs((prev) =>
          prev.includes(vmName)
            ? prev.filter((name) => name !== vmName)
            : [...prev, vmName]
        );
    };
    // 🔍 根据状态渲染图标和颜色
    const renderStatusIcon = (status: string) => {
        if (status.toLowerCase().includes('deallocated')) {
        return <HighlightOffIcon color="disabled" />;
        }
        if (status.toLowerCase().includes('running')) {
        return <CheckCircleIcon color="success" />;
        }
        return <ComputerIcon color="primary" />;
    };

    //📤 提交选中 VM 的方法
    const handleSubmit = async () => {
        try {
            await agent.Create.submitSelectedVMs({
                sub: firstSelection,
                group: secondSelection,
                vms: selectedVMs,
            });
            alert('Submission successful!');
        } catch (err) {
            alert('Submission failed!');
        }
    };
      
    // 🔔 全局提示
    const showSnackbar = (msg: string, severity: typeof snackbarSeverity = 'info') => {
      setSnackbarMessage(msg);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    };
  
    const handleSnackbarClose = () => setSnackbarOpen(false);
  
    // ✅ 通用请求提交封装调用
    const handleInsertGroup = (e: React.FormEvent) => {
      if (!group) return showSnackbar("Please select a Group first!", "warning");
  
      const data = { subscription, group };
      handleGenericSubmit(
        e,
        data,
        async (d) => {
          await agent.Create.InsertQCommandByGroupNameJson(JSON.stringify(d.group));
          return d;
        },
        () => true,
        setLoading,
        "Are you sure you want to insert the cache from this group into the queue?"
      );
    };
  
    const handleRunTasks = (e: React.FormEvent) => {
      const data = { subscription, secondSelection };
      handleGenericSubmit(
        e,
        data,
        async (d) => {
            agent.Create.executetasksJson(subscription,secondSelection,selectedVMs);
            return d;
        },
        () => true,
        setLoading,
        "Are you sure you want to start the Routine Test? This will initiate task execution."
      );
    };
  
    const handleFetchResult = (e: React.FormEvent) => {
      if (!selectedDate) return showSnackbar("Please select a Date first!", "warning");
  
      const data = { selectedDate };
      handleGenericSubmit(
        e,
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
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCacheDate(e.target.value);
    };
  
    // 📦 下载测试数据
    const fetchAndDownloadTxt = async () => {
      if (!cacheDate) return showSnackbar("Please enter Cache Date!", "warning");
  
      try {
        const res = await agent.Create.GetBenchmarkDataBlob(cacheDate, { responseType: 'blob' });
        const url = URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `BenchmarkData_${cacheDate}.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSnackbar("Download success!", "success");
      } catch (err) {
        console.error("Error downloading the file:", err);
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

            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                {/* 🔹 Sub 选择（左文字 + 右选择框） */}
                <Box display="flex" alignItems="center" gap={2} mt={2}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: 180 }}>
                    Select Subscription :
                    </Typography>
                    <FormControl sx={{ flex: 1 }}>
                    <Select
                        value={firstSelection}
                        onChange={(e) => setFirstSelection(e.target.value)}
                    >
                        <MenuItem value="1e57c478-0901-4c02-8d35-49db234b78d2">
                        Cache Team - Vendor CTI Testing 2
                        </MenuItem>
                        <MenuItem value="fc2f20f5-602a-4ebd-97e6-4fae3f1f6424">
                        CacheTeam - Redis Perf and Stress Resources
                        </MenuItem>
                    </Select>
                    </FormControl>
                </Box>

                {/* 🔸 Group 选择（左文字 + 右选择框） */}
                <Box display="flex" alignItems="center" gap={2} mt={2}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: 180 }}>
                    Select Resource group:
                    </Typography>
                    <FormControl sx={{ flex: 1 }}>
                    {/* <InputLabel>选择 Group</InputLabel> */}
                    <Select
                        value={secondSelection}
                        onChange={handleGroupSelectionChange}
                    >
                        {secondSelectionOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                </Box>

                {/* 🔻 VM 列表展示区（保持不变） */}
                {loadingVMs ? (
                    <Box display="flex" justifyContent="center" mt={3}>
                    <CircularProgress />
                    </Box>
                ) : (
                    Object.keys(vmMap).length > 0 && (
                    <Box mt={2}>
                        <Typography variant="h6">VM Status:</Typography>
                        <List>
                        {Object.entries(vmMap).map(([vmName, status]) => (
                            <ListItem key={vmName} onClick={() => handleVmToggle(vmName)}>
                            <Checkbox
                                edge="start"
                                checked={selectedVMs.includes(vmName)}
                                tabIndex={-1}
                                disableRipple
                            />
                            <ListItemIcon>{renderStatusIcon(status)}</ListItemIcon>
                            <ListItemText primary={vmName} secondary={status} />
                            </ListItem>
                        ))}
                        </List>
                    </Box>
                    )
                )}
                </Box>


            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, gap: 3 }}>
                <Box sx={{ width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Select the target cache resource group:
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
