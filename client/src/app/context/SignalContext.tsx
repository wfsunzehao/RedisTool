import React, { createContext, useContext, useEffect, useState } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

// SignalContext 类型定义
interface SignalContextType {
  connection: HubConnection | null;
  randomObjects: { name: string; time: string; status: string }[]; // 存储随机对象
  isConnected: boolean;
  clearRandomObjects: () => void; // 清除随机对象
  sendRandomObjectManually: () => void; // 手动请求随机对象
  startTimerManually: () => void; // 手动启动定时器
  stopTimerManually: () => void; // 手动停止定时器
}

export const SignalContext = createContext<SignalContextType | undefined>(undefined);

interface SignalProviderProps {
  children: React.ReactNode;
}

export const SignalProvider: React.FC<SignalProviderProps> = ({ children }) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [randomObjects, setRandomObjects] = useState<{ name: string; time: string; status: string }[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // 创建并初始化 SignalR 连接
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7179/createHub", { withCredentials: true })
      .build();

    // 启动连接
    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log("Connected to SignalR Hub");
        setIsConnected(true);
      } catch (err) {
        console.error("Error while starting connection: " + err);
        setIsConnected(false);
      }
    };

    // 连接关闭时，尝试重新连接
    newConnection.onclose(async (error) => {
      console.log("Connection lost, attempting to reconnect...", error);
      setIsConnected(false);
      await startConnection(); // 尝试重新连接
    });

    // 收到数据时，更新 randomObjects
    newConnection.on("ReceiveRandomObject", (randomObject: { name: string; time: string; status: string }) => {
      console.log("Received random object:", randomObject);
      setRandomObjects((prevObjects) => [...prevObjects, randomObject]);
    });

    // 初始化连接
    startConnection();

    setConnection(newConnection);

    // 清理连接
    return () => {
      newConnection.stop().catch((err) => console.error("Error stopping connection: " + err));
    };
  }, []); // 只在组件加载时初始化一次

  // 清空 randomObjects
  const clearRandomObjects = () => {
    setRandomObjects([]); // 清空已接收的对象
  };

  // 手动发送请求
  const sendRandomObjectManually = () => {
    if (connection && isConnected) {
      connection
        .send("SendRandomObjectManually")
        .then(() => {
          console.log("Manual request sent");
        })
        .catch((err) => console.log("Error sending manual request: " + err));
    } else {
      console.log("Cannot send manual request, connection not established.");
    }
  };

  // 手动启动定时器
  const startTimerManually = () => {
    if (connection && isConnected) {
      connection
        .send("StartTimerManually")
        .then(() => {
          console.log("Timer started manually");
        })
        .catch((err) => console.log("Error starting timer manually: " + err));
    }
  };

  // 手动停止定时器
  const stopTimerManually = () => {
    if (connection && isConnected) {
      connection
        .send("StopTimerManually")
        .then(() => {
          console.log("Timer stopped manually");
        })
        .catch((err) => console.log("Error stopping timer manually: " + err));
    }
  };

  return (
    <SignalContext.Provider value={{ connection, randomObjects, isConnected, clearRandomObjects, sendRandomObjectManually, startTimerManually, stopTimerManually }}>
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
