import React, { useEffect, useState } from 'react'
import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    TextField,
    Autocomplete,
    Typography,
} from '@mui/material'
import agent from '../../../app/api/agent'
import { DataModel } from '../../../common/models/DataModel'
import { BVTTestCaseNames, Overlay, subscriptionList } from '../../../common/constants/constants'
import LoadingComponent from '../../../common/components/CustomLoading'
import { handleGenericSubmit } from '../../../app/util/util'
import { useMessageContext } from '@/app/context/MessageContext'
import MessageHandler from '@/layout/MessageHandler'

const BvtPage: React.FC = () => {
    const [subscription, setSubscription] = useState('')
    const [group, setGroup] = useState('')
    const [name, setName] = useState('')
    const [region, setRegion] = useState('')
    const [quantity, setQuantity] = useState('')

    const [selectedNames, setSelectedNames] = useState<string[]>([])
    const [option, setOption] = useState('all')
    const [loading, setLoading] = useState(false)
    const [groupList, setGroupList] = useState<string[]>([])
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const [isOpen, setIsOpen] = useState(true)
    const { addMessage } = useMessageContext()

    // 初始化
    useEffect(() => {
        setSubscription('1e57c478-0901-4c02-8d35-49db234b78d2')
        agent.Create.getGroup('1e57c478-0901-4c02-8d35-49db234b78d2')
            .then((response) => {
                const sortedResponse = response.sort(
                    (a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()) // 忽略大小写排序
                )
                setGroupList(sortedResponse)
            })
            .catch((error) => console.log(error.response))
    }, [])

    // 校验表单
    const CheckForm = () => {
        const newErrors: { [key: string]: string } = {}
        if (!subscription) newErrors.subscription = 'Subscription cannot be empty'
        if (!group || !groupList.includes(group)) newErrors.group = 'Group cannot be empty or invalid'
        if (option === 'case' && selectedNames.length === 0) newErrors.selectedNames = 'Select at least one'
        if (option === 'case' && selectedNames.length === 1 && quantity.trim() === '') {
            newErrors.quantity = 'Quantity cannot be empty'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const apiPathFunction = async (data: DataModel) => {
        const apiPath = option === 'case' ? agent.Create.sendOneBvtJson : agent.Create.sendAllBvtJson
        return await apiPath(data)
    }

    const handleSubmit = (event: React.FormEvent) => {
        const data: DataModel = {
            name,
            region: 'Central US EUAP',
            subscription,
            group,
            port: '6379',
            ...(option === 'case' && {
                cases: selectedNames,
                ...(selectedNames.length === 1 && { quantity: quantity }),
            }),
        }
        handleGenericSubmit(event, data, apiPathFunction, CheckForm, setLoading)
        addMessage('Cache Creation Successful', `Cache created at ${new Date().toLocaleTimeString()}.`)
    }

    const handleCancel = () => {
        setSubscription('')
        setGroup('')
        setSelectedNames([])
        setQuantity('')
        setErrors({})
    }

    const handleSubChange = (subscriptionid: string) => {
        setSubscription(subscriptionid)
        setErrors((prevErrors) => ({ ...prevErrors, subscription: '' }))
        agent.Create.getGroup(subscriptionid)
            .then((response) => {
                const sortedResponse = response.sort(
                    (a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()) // 忽略大小写排序
                )
                setGroupList(sortedResponse)
            })
            .catch((error) => console.log(error.response))
    }

    const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = event.target
        switch (field) {
            case 'name':
                setName(value)
                setErrors((prevErrors) => ({ ...prevErrors, name: '' }))
                break
            case 'quantity':
                setQuantity(value)
                setErrors((prevErrors) => ({ ...prevErrors, quantity: '' }))
                break
            default:
                break
        }
    }

    const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value as string[]
        setSelectedNames(value)
        if (value.length > 0) {
            setErrors((prevErrors) => ({ ...prevErrors, selectedNames: '' }))
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
                Create: BVT Cache
            </Typography>
            <form className="submit-box" onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <FormControl variant="outlined" sx={{ width: '100%', marginTop: 2 }}>
                        <TextField
                            select
                            label="Subscription"
                            value={subscription}
                            onChange={(e) => handleSubChange(e.target.value)}
                            variant="outlined"
                            error={!!errors.subscription}
                            helperText={errors.subscription}
                            fullWidth
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
                            onChange={(event, newValue) => {
                                setGroup(newValue || '')
                                setErrors((prevErrors) => ({ ...prevErrors, group: '' }))
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

                    <FormControl component="fieldset" sx={{ marginTop: 2 }}>
                        <RadioGroup row value={option} onChange={(e) => setOption(e.target.value)}>
                            <FormControlLabel value="all" control={<Radio />} label="All" />
                            <FormControlLabel value="case" control={<Radio />} label="Case" />
                        </RadioGroup>
                    </FormControl>

                    {option === 'case' && (
                        <>
                            <FormControl
                                variant="outlined"
                                sx={{ width: '100%', marginTop: 2 }}
                                error={!!errors.selectedNames}
                            >
                                <InputLabel id="names-label">Case</InputLabel>
                                <Select
                                    labelId="names-label"
                                    multiple
                                    value={selectedNames}
                                    onChange={handleSelectChange}
                                    input={<OutlinedInput label="Case" />}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {BVTTestCaseNames.map((name) => (
                                        <MenuItem key={name} value={name}>
                                            <Checkbox checked={selectedNames.includes(name)} />
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.selectedNames && <FormHelperText error>{errors.selectedNames}</FormHelperText>}
                            </FormControl>

                            {selectedNames.length === 1 && (
                                <TextField
                                    label="quantity"
                                    type="number"
                                    value={quantity}
                                    onChange={handleInputChange('quantity')}
                                    variant="outlined"
                                    error={!!errors.quantity}
                                    helperText={errors.quantity}
                                    sx={{ width: '100%', marginTop: 2 }}
                                />
                            )}
                        </>
                    )}

                    {/* <Alert sx={{ mt: 2 }} severity="warning">
            Please proceed with caution. A cache will be created after submission.
          </Alert> */}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary" sx={{ mx: 1, textTransform: 'none' }}>
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
            </form>
            <MessageHandler isOpen={isOpen} onClose={() => setIsOpen(false)} />
            {loading && (
                <Overlay>
                    <LoadingComponent message="Submitting, please wait..." />
                </Overlay>
            )}
        </Box>
    )
}

export default BvtPage
