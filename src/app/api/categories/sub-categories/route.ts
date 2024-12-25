import { NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryName = searchParams.get("category");

    // 먼저 카테고리를 찾음
    const category = await prisma.category.findFirst({
      where: {
        name: categoryName as string,
      },
    });

    if (!category) {
      return NextResponse.json([]);
    }

    // 찾은 카테고리의 서브카테고리들을 조회
    const subCategories = await prisma.subcategory.findMany({
      where: {
        categoryId: category.id,
      },
    });

    return NextResponse.json(subCategories);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
