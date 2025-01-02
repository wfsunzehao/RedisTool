import React, { useState } from 'react'
import NotificationPanel from './NotificationPanel'

// 消息数据类型
interface Message {
    title: string
    content: string
}

const fixedMessages: Message[] = [
    { title: 'Cache creation in progress', content: 'Zhangxin created perf cache at 10 pm.' },
    { title: 'Creation is complete', content: 'Zhangxin created the ManulTest cache at 1:56 pm.' },
    { title: 'Deletion is complete', content: 'Zhangxin deleted the cache for group test at 1:56 pm.' },
]

interface MessageHandlerProps {
    isOpen: boolean
    onClose: () => void
}

const MessageHandler: React.FC<MessageHandlerProps> = ({ isOpen, onClose }) => {
    return <>{isOpen && <NotificationPanel messages={fixedMessages} onClose={onClose} />}</>
}

export default MessageHandler
