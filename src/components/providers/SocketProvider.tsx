"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  // 연결된 socket.io 클라이언트 인스턴스 상태
  const [socket, setSocket] = useState<any | null>(null);
  // 클라이언트가 서버에 연결되었는지 여부를 나타내는 상태
  const [isConnected, setIsConnected] = useState(false);
  const pathname = usePathname();

  // socket.io 초기화
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

    // socket.io 클라이언트 인스턴스 생성
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      }
    );

    // 서버와 성공적으로 연결되었을 때
    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    // 서버와 연결이 끊어졌을 때
    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    // 컴포넌트가 언마운트될 때 socket.io 연결 해제
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
