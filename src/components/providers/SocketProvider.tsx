"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // 채팅 관련 경로에서만 소켓 연결
    if (!pathname?.startsWith("/chat")) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Socket.io 클라이언트 설정 및 초기화
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    // 서버와 성공적으로 연결되었을 때
    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    // 서버와 연결이 끊어졌을 때
    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    // 연결 실패 시
    socketInstance.on("connect_error", () => {
      setIsConnected(false);

      const newSocket = io(process.env.NEXT_PUBLIC_API_URL, {
        ...socketInstance.io.opts,
        transports: ["polling"],
      });
      setSocket(newSocket);
      setIsConnected(true);
    });

    setSocket(socketInstance);

    // 컴포넌트가 언마운트될 때 socket.io 연결 해제
    return () => {
      socketInstance.removeAllListeners();
      socketInstance.disconnect();
    };
  }, [pathname]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
