import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/helpers/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    const users = await prisma.user.findMany({
      include: {
        conversation: {
          include: {
            messages: {
              include: {
                sender: true,
                receiver: true,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
            users: true,
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.log("[CHAT_GET]", error);
  }
}
