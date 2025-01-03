import React, { createContext, useContext, useState, ReactNode } from 'react'

// 消息类型定义
interface Message {
    title: string
    content: string
}

// 上下文类型定义
interface MessageContextType {
    messages: Message[]
    addMessage: (title: string, content: string) => void
}

// 创建上下文
const MessageContext = createContext<MessageContextType | undefined>(undefined)

// 提供者组件
export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([])

    const addMessage = (title: string, content: string) => {
        setMessages((prevMessages) => [{ title, content }, ...prevMessages])
    }

    return <MessageContext.Provider value={{ messages, addMessage }}>{children}</MessageContext.Provider>
}

// 使用上下文的自定义 Hook
export const useMessageContext = () => {
    const context = useContext(MessageContext)
    if (!context) {
        throw new Error('useMessageContext must be used within a MessageProvider')
    }
    return context
}
