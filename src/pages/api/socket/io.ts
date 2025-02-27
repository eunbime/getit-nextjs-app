import { NextApiResponseServerIo } from "@/types/socket";
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

// 기본 Next.js의 bodyParser를 비활성화
export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  try {
    // 서버에 연결되어 있지 않다면 socket.io 서버 초기화
    if (!res.socket.server.io) {
      const path = "/api/socket/io";
      const httpServer: NetServer = res.socket.server as any;
      const io = new ServerIO(httpServer, {
        path: path,
        //@ts-ignore
        addTrailingSlash: false, // 타입 오류 방지
        pingTimeout: 60000,
        pingInterval: 25000,
        connectTimeout: 5000,
        transports: ["polling", "websocket"],
        cors: {
          origin: process.env.NEXT_PUBLIC_API_URL,
          methods: ["GET", "POST"],
          credentials: true,
        },
      });

      // 기본 연결 이벤트 핸들러
      io.on("connection", (socket) => {
        console.log("클라이언트 연결됨:", socket.id);
      });

      res.socket.server.io = io;
    }

    res.end(); // 응답 종료
  } catch (error) {
    console.error("Socket.io 서버 초기화 중 오류 발생", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default ioHandler;
