import React, { createContext, useContext, useState, ReactNode } from 'react'

// Definition of the message type
interface Message {
    title: string
    content: string
}

// Definition of the context type
interface MessageContextType {
    messages: Message[]
    addMessage: (title: string, content: string) => void
}

// Create the context
const MessageContext = createContext<MessageContextType | undefined>(undefined)

// Provider component
export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([])

    const addMessage = (title: string, content: string) => {
        setMessages((prevMessages) => [{ title, content }, ...prevMessages])
    }

    return <MessageContext.Provider value={{ messages, addMessage }}>{children}</MessageContext.Provider>
}

// Custom Hook for using the context
export const useMessageContext = () => {
    const context = useContext(MessageContext)
    if (!context) {
        throw new Error('useMessageContext must be used within a MessageProvider')
    }
    return context
}
