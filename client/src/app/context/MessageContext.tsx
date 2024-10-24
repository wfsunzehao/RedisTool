import React, { createContext, useContext, useState } from 'react';

interface Message {
  text: string;
  timestamp: number;
}

interface MessageContextType {
  messages: Message[];
  addMessage: (message: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]); // 更新为 Message 数组

  const addMessage = (message: string) => {
    const newMessage: Message = {
      text: message,
      timestamp: Date.now(), // 获取当前时间戳
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]); // 添加新消息
  };

  return (
    <MessageContext.Provider value={{ messages, addMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};
