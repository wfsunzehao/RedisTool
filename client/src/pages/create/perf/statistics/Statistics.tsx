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

interface Parameter {
    name: string
    region: string
    description: string
    clients: string
    threads: string
    size: string
    requests: string
    pipeline: string
    status: '1' | '2' | '3'
}

const Statistics: React.FC = () => {
    const [parameters, setParameters] = useState<Parameter[]>([])
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5139/api/parameters')
            setParameters(response.data)
        } catch (error) {
            console.error('Error fetching the parameters!', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleNavigate = () => {
        navigate('/dataDisplayPage')
    }

    const renderStatusButton = (status: Parameter['status']) => {
        const statusMap: Record<
            Parameter['status'],
            {
                label: string
                color: 'inherit' | 'success' | 'warning' | 'primary' | 'secondary' | 'error' | 'info'
                disabled: boolean
            }
        > = {
            '1': { label: 'Successful', color: 'success', disabled: false },
            '2': { label: 'In Progress', color: 'warning', disabled: true },
            '3': { label: 'Running', color: 'primary', disabled: true },
        }

        const { label, color, disabled } = statusMap[status]
        return (
            <Button
                variant="contained"
                color={color} // 传递枚举值
                onClick={handleNavigate}
                disabled={disabled}
                size="small"
                sx={{ textTransform: 'none', fontSize: '14px' }}
            >
                {label}
            </Button>
        )
    }

    return (
        <Box sx={{ padding: '20px', marginLeft: '5%', height: '80vh' }}>
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
                Statistics
            </Typography>
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
                                    <TableCell>{renderStatusButton(param.status)}</TableCell>
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
