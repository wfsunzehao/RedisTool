// SignalContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

// 创建 SignalContext 类型定义
interface SignalContextType {
  connection: HubConnection | null;
  messages: string[];
  isConnected: boolean;
  sendMessage: (message: string) => void;
  clearMessages: () => void; // 添加 clearMessages 方法
}

export const SignalContext = createContext<SignalContextType | undefined>(undefined);

interface SignalProviderProps {
  children: React.ReactNode;
}

export const SignalProvider: React.FC<SignalProviderProps> = ({ children }) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<string[]>(() => {
    const storedMessages = localStorage.getItem("messages");
    return storedMessages ? JSON.parse(storedMessages) : [];
  });
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7179/createHub", {
        withCredentials: true,
      })
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR Hub");
        setIsConnected(true);
      })
      .catch((err) => {
        console.error("Error while starting connection: " + err);
        setIsConnected(false);
      });

    newConnection.on("ReceiveMessage", (user: string, message: string) => {
      const newMessage = `${user}: ${message}`;
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    setConnection(newConnection);

    return () => {
      newConnection.stop().catch((err) => console.error("Error stopping connection: " + err));
    };
  }, []);

  const sendMessage = (message: string) => {
    if (connection && isConnected) {
      connection
        .send("SendMessage", "User1", message)
        .then(() => {
          console.log("Message sent");
        })
        .catch((err) => console.log("Error sending message: " + err));
    } else {
      console.log("Cannot send message, connection not established.");
    }
  };

  // 清除消息的方法
  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("messages"); // 清除 localStorage 中的消息
  };

  return (
    <SignalContext.Provider value={{ connection, messages, isConnected, sendMessage, clearMessages }}>
      {children}
    </SignalContext.Provider>
  );
};

export const useSignalContext = (): SignalContextType => {
  const context = useContext(SignalContext);
  if (!context) {
    throw new Error("useSignalContext must be used within a SignalProvider");
  }
  return context;
};
