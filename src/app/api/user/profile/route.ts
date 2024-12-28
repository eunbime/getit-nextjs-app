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
    console.error("[PROFILE_UPDATE_ERROR]", error);
    return new NextResponse("서버 오류가 발생했습니다", { status: 500 });
  }
}
