import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function GET(
  // 사용하지 않을 경우 _ 로 명시적으로 표시
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    if (!productId || typeof productId !== "string") {
      // 콘솔로그는 개발 후 삭제하기
      console.log("Invalid Product ID");
      throw new Error("Invalid Product ID");
    }

    const category = await prisma.category.findMany({
      where: {
        products: {
          some: {
            id: productId,
          },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    // 콘솔로그는 개발 후 삭제하기
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
