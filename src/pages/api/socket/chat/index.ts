import { NextApiResponseServerIo } from "@/types/socket";
import { NextApiRequest } from "next";
import prisma from "@/helpers/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    const { text, image, receiverId, senderId } = req.body;

    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID missing" });
    }

    if (!senderId) {
      return res.status(400).json({ error: "Sender ID missing" });
    }

    // 대화 찾기 또는 생성
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                id: senderId,
              },
            },
          },
          {
            users: {
              some: {
                id: receiverId,
              },
            },
          },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          senderId,
          receiverId,
          users: {
            connect: [{ id: senderId }, { id: receiverId }],
          },
        },
      });
    }

    // 메시지 생성
    const message = await prisma.message.create({
      data: {
        text: text || "",
        image: image || "",
        conversationId: conversation.id,
        senderId,
        receiverId,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    // 소켓 이벤트 발생
    const channelKey = `chat:${conversation.id}`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[CHAT_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
