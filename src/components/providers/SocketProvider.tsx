"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import type { transports } from "engine.io-client";

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
  // 연결된 socket.io 클라이언트 인스턴스 상태
  const [socket, setSocket] = useState<Socket | null>(null);
  // 클라이언트가 서버에 연결되었는지 여부를 나타내는 상태
  const [isConnected, setIsConnected] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // 채팅 관련 경로에서만 소켓 연결하도록 최적화
    if (!pathname?.startsWith("/chat")) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Socket.io 클라이언트 설정 및 초기화
    const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      transports: ["polling", "websocket"],
      reconnection: true, // 재연결 활성화
      reconnectionAttempts: 5, // 최대 재시도 횟수
      reconnectionDelay: 1000, // 재연결 시도 간격 (ms)
      timeout: 20000,
      // autoConnect: false,
    });

    // 서버와 성공적으로 연결되었을 때
    socketInstance.on("connect", () => {
      console.log("Socket.io 연결 성공");
      setIsConnected(true);
    });

    // 서버와 연결이 끊어졌을 때
    socketInstance.on("disconnect", (reason: any) => {
      console.log("Socket.io 연결 끊김", reason);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err: any) => {
      console.error("Socket 연결 에러:", err);
      setIsConnected(false);

      // 새로운 소켓 인스턴스 생성
      const newSocket = io(process.env.NEXT_PUBLIC_SITE_URL!, {
        ...socketInstance.io.opts,
        transports: ["polling"],
      });
      setSocket(newSocket);
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
