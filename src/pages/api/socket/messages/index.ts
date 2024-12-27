import { NextApiResponseServerIo } from "@/types/socket";
import { NextApiRequest } from "next";
import prisma from "@/helpers/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  // GET 요청 처리
  if (req.method === "GET") {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { conversationId, cursor } = req.query;
      const MESSAGES_BATCH = 10;

      if (!conversationId) {
        return res.status(400).json({ error: "Conversation ID missing" });
      }

      let messages;

      if (cursor) {
        messages = await prisma.message.findMany({
          take: MESSAGES_BATCH,
          skip: 1,
          cursor: {
            id: cursor as string,
          },
          where: {
            conversationId: conversationId as string,
          },
          include: {
            sender: true,
            receiver: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } else {
        messages = await prisma.message.findMany({
          take: MESSAGES_BATCH,
          where: {
            conversationId: conversationId as string,
          },
          include: {
            sender: true,
            receiver: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }

      let nextCursor = null;

      if (messages.length === MESSAGES_BATCH) {
        nextCursor = messages[MESSAGES_BATCH - 1].id;
      }

      return res.status(200).json({
        items: messages,
        nextCursor,
      });
    } catch (error) {
      console.log("[MESSAGES_GET]", error);
      return res.status(500).json({ error: "Internal Error" });
    }
  }

  // POST 요청 처리
  if (req.method === "POST") {
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

      const conversationKey = `chat:${conversation.id}:messages`;
      res?.socket?.server?.io?.emit(conversationKey, message);

      return res.status(200).json(message);
    } catch (error) {
      console.log("[MESSAGES_POST]", error);
      return res.status(500).json({ message: "Internal Error" });
    }
  }

  // 다른 HTTP 메서드에 대한 처리
  return res.status(405).json({ error: "Method not allowed" });
}
