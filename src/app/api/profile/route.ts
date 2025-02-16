import prisma from "@/helpers/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    console.log(name);

    if (!name || typeof name !== "string") {
      return new NextResponse("유효하지 않은 닉네임입니다", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id as string,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse("Internal Error", {
        status: 500,
        statusText: error.message,
      });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
