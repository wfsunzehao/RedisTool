import React, { createContext, useContext, useEffect, useState } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

// SignalContext 类型定义
interface SignalContextType {
  connection: HubConnection | null;
  randomObjects: { name: string; time: string; status: string }[]; // 存储随机对象
  isConnected: boolean;
  clearRandomObjects: () => void; // 清除随机对象
  sendRandomObjectManually: () => void; // 手动请求随机对象
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
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7179/createHub", { withCredentials: true })
      .build();

    // 尝试建立连接
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

    // 监听后端发送的随机对象
    newConnection.on("ReceiveRandomObject", (randomObject: { name: string; time: string; status: string }) => {
      console.log("Received random object:", randomObject); // 打印接收到的对象
      setRandomObjects((prevObjects) => [...prevObjects, randomObject]); // 更新随机对象列表
    });

    setConnection(newConnection);

    return () => {
      newConnection.stop().catch((err) => console.error("Error stopping connection: " + err));
    };
  }, []);

  const clearRandomObjects = () => {
    setRandomObjects([]); // 清空已接收的对象
  };

  // 手动请求随机对象
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

  return (
    <SignalContext.Provider value={{ connection, randomObjects, isConnected, clearRandomObjects, sendRandomObjectManually }}>
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
