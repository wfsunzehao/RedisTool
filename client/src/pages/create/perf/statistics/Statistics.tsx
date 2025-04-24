import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Box,
} from '@mui/material'
import axios from 'axios'
import agent from '@/app/api/agent'
import { Grid } from '@mui/material'
import { handleGenericSubmit } from '@/app/util/util'


interface Parameter {
    name: string
    region: string
    description: string
    clients: string
    threads: string
    size: string
    requests: string
    pipeline: string
    timeStamp:  string
    status: '1' | '2' | '3' | '4'
}

const Statistics: React.FC = () => {
    const [parameters, setParameters] = useState<Parameter[]>([])
    const navigate = useNavigate()
    const [loadingQueue, setLoadingQueue] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);


    
    const fetchData = async () => {
        try {
            const response = await agent.Create.sendGetBenchmarkRequestData()
            // console.log('Fetched data:', response)
            setParameters(response.reverse())
        } catch (error) {
            // console.error('Error fetching the parameters!', error)
            setParameters([]) 
        }
    }

    useEffect(() => {
        fetchData() // 首次加载立即获取一次
    
        const intervalId = setInterval(() => {
            fetchData()
        }, 5000) // 每 5 秒自动拉取一次数据
    
        return () => clearInterval(intervalId) // 组件卸载时清除定时器
    }, [])
    
    const handleFlushQueue = async (event: React.FormEvent) => {
        await handleGenericSubmit(
            event,
            {}, 
            () => agent.Create.FlushQueue(), 
            () => true, 
            setLoadingQueue,
            'Are you sure you want to flush the benchmark queue?' // 确认文本
        )
    }
    const handleFlushRequest = async (event: React.FormEvent) => {
        await handleGenericSubmit(
            event,
            {}, 
            () => agent.Create.FlushRequest(), 
            () => true, 
            setLoadingRequest,
            'Are you sure you want to flush the benchmark Request?' // 确认文本
        )
    }

    const handleNavigate = (timeStamp: string) => {
        navigate(`/create/dataDisplayPage/${timeStamp}`);
    };

    const renderStatusButton = (status: Parameter['status'], timeStamp : string) => {
        const statusMap: Record<
            Parameter['status'],
            {
                label: string
                color: 'inherit' | 'success' | 'warning' | 'primary' | 'secondary' | 'error' | 'info'
                disabled: boolean
            }
        > = {
            '3': { label: 'Successful', color: 'success', disabled: false },
            '2': { label: 'Pending', color: 'inherit', disabled: true },
            '1': { label: 'Running', color: 'secondary', disabled: true },
            '4': { label: 'Failed', color: 'error', disabled: true },
        }

        const { label, color, disabled } = statusMap[status]
        return (
            <Button
                variant="contained"
                color={color} // 传递枚举值
                onClick={() => handleNavigate(timeStamp)}
                disabled={true}
                size="small"
                sx={{
                    textTransform: 'none',
                    fontSize: '14px',
                    width: '150px', // Ensure all buttons have the same size
                    height: '40px', // Ensure consistent height
                    opacity: 1, // Keep opacity as 1 even for disabled button
                    backgroundColor: disabled ? `${color}.main` : `${color}.light`, // Manually control the background color
                    '&:disabled': {
                        backgroundColor: `${color}.main`, // Ensure background color remains the same when disabled
                        opacity: 1, // Make sure opacity stays normal for disabled buttons
                        color: 'white', // Set text color to white for disabled buttons
                    },
                }}
            >
                {label}
            </Button>
        )
    }

    return (
        <Box sx={{ padding: '20px', marginLeft: '5%', minHeight: '60vh', overflow: 'auto' }}>
           <Box sx={{ marginBottom: 2 }}>
    <Grid container alignItems="center">
    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography
                variant="h3"
                align="center"
                sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '30px',
                    width: '100%',
                }}
            >
                Statistics
            </Typography>
        </Grid>
        <Grid item xs={6} />
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2 }}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleFlushQueue}
                disabled={loadingQueue}
                sx={{ height: '40px', textTransform: 'none', marginRight: 2 }}
            >
                Flush Queue
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleFlushRequest}
                disabled={loadingRequest}
                sx={{ height: '40px', textTransform: 'none' }}
            >
                Flush Request
            </Button>
        </Grid>
        
    </Grid>
</Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Region</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Clients</TableCell>
                            <TableCell>Threads</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell>Requests</TableCell>
                            <TableCell>Pipeline</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {parameters.map((param, index) => (
                            <React.Fragment key={index}>
                                <TableRow>
                                    <TableCell>{param.name}</TableCell>
                                    <TableCell>{param.region}</TableCell>
                                    <TableCell>{param.description}</TableCell>
                                    <TableCell>{param.clients}</TableCell>
                                    <TableCell>{param.threads}</TableCell>
                                    <TableCell>{param.size}</TableCell>
                                    <TableCell>{param.requests}</TableCell>
                                    <TableCell>{param.pipeline}</TableCell>
                                    <TableCell>{renderStatusButton(param.status,param.timeStamp)}</TableCell>
                                </TableRow>
                                {index !== parameters.length - 1 && (
                                    <TableRow>
                                        <TableCell colSpan={9} sx={{ borderBottom: '2px solid #f0f0f0' }}></TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default Statistics
