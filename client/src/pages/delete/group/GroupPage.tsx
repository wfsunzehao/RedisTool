import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    FormControl,
    MenuItem,
    TextField,
    List,
    ListItem,
    ListItemText,
    Divider,
    Autocomplete,
    Typography,
} from '@mui/material'
import agent from '../../../app/api/agent'
import LoadingComponent from '../../../common/components/CustomLoading'
import { Overlay, subscriptionList } from '../../../common/constants/constants'
import { DeleteModel } from '../../../common/models/DeleteModel'
import { handleGenericSubmit } from '../../../app/util/util'
import { useMessageContext } from '@/app/context/MessageContext'
import MessageHandler from '@/layout/MessageHandler'

const GroupPage: React.FC = () => {
    const [subscription, setSubscription] = useState('')
    const [group, setGroup] = useState('')
    const [loading, setLoading] = useState(false)
    const [groupList, setGroupList] = useState<string[]>([])
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [resourceList, setResourceList] = useState<string[]>([]) // 资源列表状态
    const [showResourceBox, setShowResourceBox] = useState(false) // 控制资源框显示与否

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

    // 每分钟更新一次资源列表
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (group) {
                // 调用API获取该组的资源列表
                agent.Delete.getResource(subscription, group)
                    .then((response) => {
                        // 将键值对格式化为字符串数组，例如 "BVT-RebootBladeTest-1203-5675: Premium"
                        const resourceList = Object.keys(response).map((key) => `${key}: ${response[key]}`)

                        // 保存资源列表（字符串数组）
                        setResourceList(resourceList)
                        setShowResourceBox(true) // 显示资源框
                    })
                    .catch((error) => {
                        console.log(error.response)
                        setResourceList([]) // 清空资源列表
                        setShowResourceBox(false) // 隐藏资源框
                    })
            }
        }, 60000) // 每 60000 毫秒（即 1 分钟）更新一次

        // 清除定时器，防止内存泄漏
        return () => {
            clearInterval(intervalId)
        }
    }, [subscription, group]) // 依赖项是 subscription 和 group，只有当它们变化时才会启动新的定时器

    // 校验表单
    const CheckForm = () => {
        const newErrors: { [key: string]: string } = {}
        if (!subscription) newErrors.subscription = 'Subscription cannot be empty'
        if (!group) newErrors.group = 'Group cannot be empty'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0 // 返回是否有错误
    }

    // 删除组的API请求
    const apiPathFunction = async (data: DeleteModel) => {
        return await agent.Delete.sendDelGroupJsonT(data)
    }

    const handleSubmit = (event: React.FormEvent) => {
        const data: DeleteModel = {
            subscription,
            resourceGroupName: group,
        }
        handleGenericSubmit(event, data, apiPathFunction, CheckForm, setLoading)
        addMessage('Deletion is complete', `Cache deleted at ${new Date().toLocaleTimeString()}.`)
    }

    // 取消按钮逻辑
    const handleCancel = () => {
        setSubscription('')
        setGroup('')
        setErrors({})
        setResourceList([]) // 取消时清空资源列表
        setShowResourceBox(false) // 隐藏资源框
    }

    // 订阅选择改变时
    const handleSubChange = (subscriptionid: string) => {
        setSubscription(subscriptionid)
        setGroup('') // 清空组选择框
        setResourceList([]) // 清空资源列表
        setShowResourceBox(false) // 隐藏资源框
        setErrors((prevErrors) => ({ ...prevErrors, subscription: '' })) // 清除订阅错误
        agent.Create.getGroup(subscriptionid)
            .then((response) => {
                const sortedResponse = response.sort(
                    (a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()) // 忽略大小写排序
                )
                setGroupList(sortedResponse)
            })
            .catch((error) => console.log(error.response))
    }

    // 组选择改变时
    const handleGroupChange = (group: string) => {
        setGroup(group)
        setErrors((prevErrors) => ({ ...prevErrors, group: '' })) // 清除组错误

        // 调用API获取该组的资源列表
        agent.Delete.getResource(subscription, group)
            .then((response) => {
                // 将键值对格式化为字符串数组，例如 "BVT-RebootBladeTest-1203-5675: Premium"
                const resourceList = Object.keys(response).map((key) => `${key}: ${response[key]}`)

                // 保存资源列表（字符串数组）
                setResourceList(resourceList)
                setShowResourceBox(true) // 显示资源框
            })
            .catch((error) => {
                console.log(error.response)
                setResourceList([]) // 清空资源列表
                setShowResourceBox(false) // 隐藏资源框
            })
    }

    const handleInputChange =
        (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value: string) => {
            //const { value } = event.target;

            switch (field) {
                case 'group':
                    handleGroupChange(value)
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
                Delete Cache
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
                            onChange={(event, value) =>
                                handleInputChange('group')(
                                    event as React.ChangeEvent<HTMLInputElement>,
                                    value as string
                                )
                            }
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
                </Box>

                {/* 显示资源列表的框 */}
                {showResourceBox && (
                    <Box
                        sx={{
                            marginTop: 3,
                            width: '100%',
                            padding: 2,
                            border: '1px solid #ccc',
                            borderRadius: 2,
                            maxHeight: 300, // 设置最大高度
                            overflowY: 'auto', // 启用垂直滚动
                        }}
                    >
                        <h3>ResourceList</h3>
                        {resourceList.length > 0 ? (
                            <List>
                                {resourceList.map((resource, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem>
                                            <ListItemText primary={resource} />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <p>No resources found.</p>
                        )}
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mx: 1, textTransform: 'none' }}
                        disabled={loading || !showResourceBox} // 添加 showResourceBox 作为禁用条件
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
            <MessageHandler isOpen={isOpen} onClose={() => setIsOpen(false)} />
            {loading && (
                <Overlay>
                    <LoadingComponent />
                </Overlay>
            )}
        </Box>
    )
}

export default GroupPage
