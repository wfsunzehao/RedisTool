import React, { useState } from 'react'
import NotificationPanel from './NotificationPanel'

// 消息数据类型
interface Message {
    title: string
    content: string
}

// 示例数据，用于替换模板中的动态内容
const dynamicData = {
    username: 'Zhangxin',
    event: 'created',
    cacheName: 'perf cache',
    time: '10 pm',
    groupName: 'test_song',
}

// 消息模板，使用动态数据替换内容
const fixedMessages: Message[] = [
    {
        title: 'Cache creation in progress',
        content: `${dynamicData.username} ${dynamicData.event} ${dynamicData.cacheName} at ${dynamicData.time}.`,
    },
    { title: 'Creation is complete', content: `${dynamicData.username} created the ManualTest cache at 1:56 pm.` },
    {
        title: 'Deletion is complete',
        content: `${dynamicData.username} deleted the cache for ${dynamicData.groupName} at 1:56 pm.`,
    },
]

interface MessageHandlerProps {
    isOpen: boolean
    onClose: () => void
}

const MessageHandler: React.FC<MessageHandlerProps> = ({ isOpen, onClose }) => {
    return <>{isOpen && <NotificationPanel messages={fixedMessages} onClose={onClose} />}</>
}

export default MessageHandler
