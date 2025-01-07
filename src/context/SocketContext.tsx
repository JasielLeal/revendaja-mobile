import { backend } from "@/api/backend";
import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import AuthContext from "./authContext";

// Defina o tipo do contexto
interface SocketContextData {
  socket: Socket | null;
}

// Crie o contexto
const SocketContext = createContext<SocketContextData>({ socket: null });

// Provedor do contexto
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useContext(AuthContext)
  useEffect(() => {
    // Configure o socket
    const socketConnection = io('http://192.168.100.153:9999', {
      transports: ["websocket"], // Use somente WebSocket
    });

    socketConnection.on('connect', () => {
      console.log('Socket connected:', socketConnection.id);
      socketConnection.emit('join-user', user?.id);
    });

    socketConnection.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(socketConnection);

    // Cleanup ao desmontar o componente
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook para usar o contexto
export const useSocket = () => useContext(SocketContext);
