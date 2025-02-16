import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { image, userId } = data;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "유효한 이미지가 필요합니다" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "사용자 ID가 필요합니다" },
        { status: 400 }
      );
    }
    const updatedImage = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        image,
      },
    });

    return NextResponse.json(updatedImage);
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
