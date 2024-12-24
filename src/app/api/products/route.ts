import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    const body = await request.json();

    const {
      title,
      description,
      imageSrc,
      category,
      latitude,
      longitude,
      price,
    } = body;

    console.log("Received body:", body); // 요청 데이터 로깅

    Object.keys(body).forEach((value: any) => {
      if (!body[value]) {
        return NextResponse.json(
          { error: `${value} is required` },
          { status: 400 }
        );
      }
    });

    // 먼저 카테고리를 찾거나 생성합니다
    const categoryRecord = await prisma.category.findFirst({
      where: {
        name: category,
      },
    });

    console.log("Found category:", categoryRecord); // 카테고리 검색 결과 로깅

    if (!categoryRecord) {
      // 카테고리가 없으면 생성
      try {
        const newCategory = await prisma.category.create({
          data: {
            name: category,
            description: `Category for ${category}`,
          },
        });
        console.log("Created new category:", newCategory);
      } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json(
          { error: `Failed to create category: ${category}` },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        imageSrc,
        categoryId: categoryRecord!.id,
        latitude,
        longitude,
        price: Number(price),
        userId: currentUser.id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}
