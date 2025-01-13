import React, { useEffect, useState } from 'react'
import { Box, Button, FormControl, TextField, CircularProgress, MenuItem, Typography } from '@mui/material'
import { Autocomplete } from '@mui/material'
import agent from '../../../app/api/agent'
import { ManModel } from '../../../common/models/DataModel'
import { handleGenericSubmit } from '../../../app/util/util'

const ManPage: React.FC = () => {
    const [subscription, setSubscription] = useState('')
    const [group, setGroup] = useState('')
    const [region, setRegion] = useState('')
    const [groupList, setGroupList] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    // Initialize load
    useEffect(() => {
        setSubscription('1e57c478-0901-4c02-8d35-49db234b78d2')
        fetchGroupList('1e57c478-0901-4c02-8d35-49db234b78d2')
    }, [])

    // Get group list
    const fetchGroupList = (subscriptionId: string) => {
        agent.Create.getGroup(subscriptionId)
            .then((response) => {
                const sortedResponse = response.sort(
                    (a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()) // Sort ignoring case
                )
                setGroupList(sortedResponse)
            })
            .catch((error) => console.error(error))
    }

    // Form validation
    const checkForm = () => {
        const newErrors: { [key: string]: string } = {}
        if (!subscription) newErrors.subscription = 'Subscription cannot be empty'
        if (!group) newErrors.group = 'Group cannot be empty'
        if (!region) newErrors.region = 'Region cannot be empty'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Submit handler
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        if (!checkForm()) return

        const data: ManModel = { region, subscription, group }
        const customMessage = 'Once started, the cache used in MAN will be created!'
        handleGenericSubmit(event, data, () => agent.Create.sendManJson(data), checkForm, setLoading, customMessage)
    }

    return (
        <Box>
            <Typography
                variant="h3"
                gutterBottom
                sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #1976d2, #9c27b0)', // Example gradient
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '30px', // You can adjust the font size as needed
                }}
            >
                Create: Manual Cache
            </Typography>
            <form className="submit-box" onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
                        <TextField
                            select
                            label="Subscription"
                            value={subscription}
                            onChange={(e) => setSubscription(e.target.value)}
                            error={!!errors.subscription}
                            helperText={errors.subscription}
                            fullWidth
                        >
                            {[
                                {
                                    value: '1e57c478-0901-4c02-8d35-49db234b78d2',
                                    label: 'Cache Team - Vendor CTI Testing 2',
                                },
                            ].map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    <FormControl sx={{ width: '100%', marginTop: 2 }}>
                        <Autocomplete
                            freeSolo={false} // Disallow custom input
                            options={groupList}
                            value={group}
                            onChange={(_e, newValue) => setGroup(newValue || '')}
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

                    <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
                        <TextField
                            select
                            label="Region"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            error={!!errors.region}
                            helperText={errors.region}
                            fullWidth
                        >
                            {['East US 2 EUAP', 'Central US EUAP', 'East US'].map((item) => (
                                <MenuItem key={item} value={item}>
                                    {item}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{ mx: 1, textTransform: 'none' }}
                        >
                            Submit
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            color="secondary"
                            disabled={loading}
                            onClick={() => {
                                setSubscription('')
                                setGroup('')
                                setRegion('')
                                setErrors({})
                            }}
                            sx={{ mx: 1, textTransform: 'none' }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </form>
            {loading && (
                <Box sx={{ mt: 2 }}>
                    <CircularProgress />
                </Box>
            )}
        </Box>
    )
}

export default ManPage
