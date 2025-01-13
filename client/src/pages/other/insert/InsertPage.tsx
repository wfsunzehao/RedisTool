import React, { useEffect, useState } from 'react'
import { Autocomplete, Box, Button, FormControl, MenuItem, TextField, Typography } from '@mui/material'
import agent from '../../../app/api/agent'
import { DataModel } from '../../../common/models/DataModel'

import LoadingComponent from '../../../common/components/CustomLoading'
import { Overlay, subscriptionList } from '../../../common/constants/constants'
import { handleGenericSubmit } from '../../../app/util/util'

const InsertPage: React.FC = () => {
    const [subscription, setSubscription] = useState('')
    const [group, setGroup] = useState('')
    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState('') // Quantity
    const [loading, setLoading] = useState(false)
    const [groupList, setGroupList] = useState<string[]>([])
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [resourceList, setResourceList] = useState<string[]>([]) // Resource list state
    // Initialization
    useEffect(() => {
        // Default display Cache Team - Vendor CTI Testing 2
        setSubscription('1e57c478-0901-4c02-8d35-49db234b78d2')
        agent.Create.getGroup('1e57c478-0901-4c02-8d35-49db234b78d2')
            .then((response) => {
                const sortedResponse = response.sort(
                    (a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()) // Case-insensitive sorting
                )
                setGroupList(sortedResponse)
            })
            .catch((error) => console.log(error.response))
    }, [])

    // Validate form
    const CheckForm = () => {
        const newErrors: { [key: string]: string } = {}
        if (!subscription) newErrors.subscription = 'Subscription cannot be empty'
        if (!group) newErrors.group = 'Group cannot be empty'
        if (!name) newErrors.name = 'Name cannot be empty' // Added name validation
        if (!quantity) newErrors.quantity = 'Quantity cannot be empty' // Added quantity validation
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0 // Returns whether there are errors
    }

    const apiPathFunction = async (data: DataModel) => {
        return await agent.Other.sendInsertJson(data) // Or other API call
    }
    const handleSubmit = (event: React.FormEvent) => {
        // Submission logic
        const data: DataModel = {
            name,
            region: 'Central US EUAP', // Replace with actual region value
            subscription,
            group,
            port: '6379',
            // Add other field values
            numKeysPerShard: quantity,
        }
        const customMessage = 'Once started, the cache will be inserted!'
        handleGenericSubmit(event, data, apiPathFunction, CheckForm, setLoading, customMessage)
    }
    // Handle cancel button click event
    const handleCancel = () => {
        setSubscription('')
        setGroup('')
        setName('') // Clear name input
        setQuantity('') // Clear quantity input
        setErrors({})
    }
    // Handle dropdown change event
    const handleSubChange = (subscriptionid: string) => {
        setSubscription(subscriptionid)
        setErrors((prevErrors) => ({ ...prevErrors, subscription: '' })) // Clear subscription error
        agent.Create.getGroup(subscriptionid)
            .then((response) => {
                const sortedResponse = response.sort(
                    (a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()) // Case-insensitive sorting
                )
                setGroupList(sortedResponse)
            })
            .catch((error) => console.log(error.response))
    }
    // Handle group selection change
    const handleGroupChange = (group: string) => {
        setGroup(group)
        setErrors((prevErrors) => ({ ...prevErrors, group: '' })) // Clear group error

        // Call API to get the resource list of this group
        agent.Delete.getResource(subscription, group)
            .then((response) => {
                // Extract all resource IDs (keys) and form a string array
                const resourceList = Object.keys(response)

                // Save the resource list (string array)
                setResourceList(resourceList)
            })
            .catch((error) => {
                console.log(error.response)
                setResourceList([]) // Clear the resource list
            })
    }
    const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value // Get value from the event

        switch (field) {
            case 'group':
                handleGroupChange(value)
                break
            case 'name':
                setName(value)
                setErrors((prevErrors) => ({ ...prevErrors, name: '' })) // Clear name error
                break
            case 'quantity':
                setQuantity(value)
                setErrors((prevErrors) => ({ ...prevErrors, quantity: '' })) // Clear quantity error
                break
            default:
                break
        }
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
                Insert Data
            </Typography>
            <form className="submit-box" onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
                        <TextField
                            select
                            label={`Subscription`}
                            value={subscription}
                            onChange={(e) => handleSubChange(e.target.value)}
                            variant="outlined"
                            error={!!errors.subscription}
                            helperText={errors.subscription}
                            fullWidth
                            disabled={loading}
                        >
                            {subscriptionList.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>

                    <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
                        <Autocomplete
                            options={groupList}
                            value={group}
                            onChange={(_, value) => handleGroupChange(value as string)} // The second parameter is the selected value
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Group"
                                    variant="outlined"
                                    error={!!errors.group}
                                    helperText={errors.group}
                                    fullWidth
                                />
                            )}
                        />
                    </FormControl>
                    <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
                        <TextField
                            select
                            label="Name"
                            value={name}
                            onChange={handleInputChange('name')} // Using a generic method
                            variant="outlined"
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                            disabled={loading || !group} // Only enable name selection after selecting a group
                        >
                            {resourceList.map((item) => (
                                <MenuItem key={item} value={item}>
                                    {item}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
                        <TextField
                            label="Quantity"
                            value={quantity}
                            onChange={handleInputChange('quantity')} // Using a generic method
                            variant="outlined"
                            error={!!errors.quantity}
                            helperText={errors.quantity}
                            fullWidth
                            disabled={loading || !name} // Only enable quantity input after selecting a name
                        ></TextField>
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mx: 1, textTransform: 'none' }}
                        disabled={loading}
                    >
                        Submit
                    </Button>
                    <Button
                        type="button"
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancel}
                        sx={{ mx: 1, textTransform: 'none' }}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </Box>
            </form>
            {loading && (
                <Overlay>
                    <LoadingComponent message="Submitting, please wait..." />
                </Overlay>
            )}
        </Box>
    )
}

export default InsertPage
