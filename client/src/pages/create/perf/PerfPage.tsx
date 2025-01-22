import React, { useEffect, useState } from 'react'
import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    MenuItem,
    TextField,
    Typography,
    InputLabel,
    Select,
} from '@mui/material'
import agent from '../../../app/api/agent'
import { PerfModel } from '../../../common/models/DataModel'
import { Overlay, subscriptionList } from '../../../common/constants/constants'
import LoadingComponent from '@/common/components/CustomLoading'
import { handleGenericSubmit } from '@/app/util/util'

const PerfPage: React.FC = () => {
    const today = new Date()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const formattedDate = `${month}${day}`

    const [subscription, setSubscription] = useState('')
    const [group, setGroup] = useState('')
    const [name, setName] = useState('')
    const [region, setRegion] = useState('')
    const [quantity, setQuantity] = useState('')
    const [time, setTime] = useState('')
    const [cacheName, setCacheName] = useState(`Verifyperformance-{SKU}-EUS2E-${formattedDate}`)
    const [loading, setLoading] = useState(false)
    const [sku, setSku] = useState('All')
    const [groupList, setGroupList] = useState<string[]>([])
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        setSubscription('1e57c478-0901-4c02-8d35-49db234b78d2')
        setRegion('East US 2 EUAP')
        agent.Create.getGroup('1e57c478-0901-4c02-8d35-49db234b78d2')
            .then((response) => {
                const sortedResponse = response.sort((a: string, b: string) =>
                    a.toLowerCase().localeCompare(b.toLowerCase())
                )
                setGroupList(sortedResponse)
            })
            .catch((error) => console.log(error.response))
    }, [])

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}
        if (!subscription) newErrors.subscription = 'Subscription is required'
        if (!group) newErrors.group = 'Group is required'
        if (!region) newErrors.region = 'Region is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const apiPathFunction = async (data: PerfModel) => {
        return await agent.Create.sendPerfJson(data)
    }

    const handleSubmit = (event: React.FormEvent) => {
        const data: PerfModel = { subscription, group, sku }
        handleGenericSubmit(event, data, apiPathFunction, validateForm, setLoading)
    }

    const handleCancel = () => {
        setSubscription('')
        setGroup('')
        setName('')
        setQuantity('')
        setRegion('')
        setErrors({})
    }

    return (
        <Box sx={{ p: 4 }}>
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
                Create: Performance Cache
            </Typography>

            <form onSubmit={handleSubmit}>
                <Box
                    sx={{
                        maxWidth: 600,
                        mx: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    <FormControl fullWidth>
                        <TextField
                            select
                            label="Subscription"
                            value={subscription}
                            onChange={(e) => setSubscription(e.target.value)}
                            error={!!errors.subscription}
                            helperText={errors.subscription}
                        >
                            {subscriptionList.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    <FormControl fullWidth>
                    <TextField
                        select
                        label="Cache Name"
                        value={cacheName}
                        onChange={(e) => setCacheName(e.target.value)}
                        error={!!errors.cacheName} // 如果有错误信息，显示错误状态
                        helperText={errors.cacheName} // 显示错误提示信息
                    >
                        <MenuItem key={cacheName} value={cacheName}>
                            {cacheName}
                        </MenuItem>
                    </TextField>
                </FormControl>
                    <FormControl fullWidth>
                        <Autocomplete
                            options={groupList}
                            value={group}
                            onChange={(_event, value) => setGroup(value || '')}
                            renderInput={(params) => (
                                <TextField {...params} label="Group" error={!!errors.group} helperText={errors.group} />
                            )}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <TextField
                            select
                            label="Region"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            error={!!errors.region}
                            helperText={errors.region}
                        >
                            <MenuItem value="East US 2 EUAP">East US 2 EUAP</MenuItem>
                        </TextField>
                    </FormControl>

                    <FormControl fullWidth>
                        <TextField
                            select
                            label="SKU"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                            error={!!errors.sku} // 如果有错误信息，显示错误状态
                            helperText={errors.sku} // 显示错误提示信息
                        >
                            {[
                                { value: 'All', label: 'All' },
                                { value: 'Basic', label: 'Basic' },
                                { value: 'Standard', label: 'Standard' },
                                { value: 'Premium', label: 'Premium' },
                            ].map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button sx={{ mx: 1, textTransform: 'none' }} type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            color="secondary"
                            onClick={handleCancel}
                            sx={{ mx: 1, textTransform: 'none' }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </form>

            {loading && (
                <Overlay>
                    <LoadingComponent />
                </Overlay>
            )}
        </Box>
    )
}

export default PerfPage
