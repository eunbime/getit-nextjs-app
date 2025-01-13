import prisma from "@/helpers/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const senderId = searchParams.get("senderId");
  const receiverId = searchParams.get("receiverId");

  const conversation = await prisma.conversation.findFirst({
    where: {
      OR: [
        {
          AND: [
            { senderId: senderId as string },
            { receiverId: receiverId as string },
          ],
        },
        {
          AND: [
            { senderId: receiverId as string },
            { receiverId: senderId as string },
          ],
        },
      ],
    },
  });

  return NextResponse.json({ exists: !!conversation });
}
