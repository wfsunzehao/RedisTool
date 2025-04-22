import React, { useState } from 'react'
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import RestoreIcon from '@mui/icons-material/Restore'

interface DataItem {
    id: number
    name: string
    detail: string
}

const mockData: DataItem[] = [
    { id: 1, name: 'Item A', detail: 'Detail for A' },
    { id: 2, name: 'Item B', detail: 'Detail for B' },
    { id: 3, name: 'Item C', detail: 'Detail for C' },
]

const mockHistoryData: DataItem[] = [
    { id: 101, name: 'Old Item A', detail: 'Old detail for A' },
    { id: 102, name: 'Old Item B', detail: 'Old detail for B' },
]

const CheckPage: React.FC = () => {
    const [token, setToken] = useState('')
    const [showHistory, setShowHistory] = useState(false)
    const [data, setData] = useState<DataItem[]>([])

    const handleTokenSubmit = () => {
        setData(mockData)
        setShowHistory(false)
    }

    const handleToggleHistory = () => {
        if (showHistory) {
            setData(mockData)
            setShowHistory(false)
        } else {
            setData(mockHistoryData)
            setShowHistory(true)
        }
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <TextField
                        fullWidth
                        label="Enter Token"
                        variant="outlined"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleTokenSubmit} sx={{ ml: 2 }}>
                        Submit
                    </Button>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">{showHistory ? 'History Records' : 'Current Data'}</Typography>
                    <Tooltip title={showHistory ? 'Back to Current' : 'View History'}>
                        <IconButton onClick={handleToggleHistory}>
                            {showHistory ? <RestoreIcon /> : <HistoryIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Detail</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.detail}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                    <Button variant="contained" color="secondary">
                        Check
                    </Button>
                    <Button variant="contained" color="success">
                        Save
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}

export default CheckPage
