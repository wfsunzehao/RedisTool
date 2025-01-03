import React from 'react'
import NotificationPanel from './NotificationPanel'
import { useMessageContext } from '@/app/context/MessageContext'

const MessageHandler: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { messages } = useMessageContext()

    return <>{isOpen && <NotificationPanel messages={messages} onClose={onClose} />}</>
}

export default MessageHandler
