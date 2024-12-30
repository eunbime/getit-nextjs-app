import { NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        user: true,
        category: true,
        subcategory: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  // 삭제 로직 추가
  try {
    const { productId } = params;
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } }
) {
  // 수정 로직 추가
  try {
    const { productId } = params;
    const data = await request.json();

    // 상품 존재 여부 확인
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "상품을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 먼저 카테고리와 서브카테고리 찾기
    const category = await prisma.category.findFirst({
      where: { name: data.category },
    });

    const subCategory = await prisma.subcategory.findFirst({
      where: { name: data.subCategory, categoryId: category!.id },
    });

    if (!category || !subCategory) {
      return NextResponse.json(
        { error: "카테고리 또는 서브카테고리를 찾을 수 없습니다" },
        { status: 400 }
      );
    }

    const updatedData = {
      title: data.title,
      description: data.description,
      category: {
        connect: { id: category.id },
      },
      subcategory: {
        connect: { id: subCategory.id },
      },
      price: parseInt(data.price),
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      imageSrc: data.imageSrc,
    };

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updatedData,
      include: {
        category: true,
        subcategory: true,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    // 더 자세한 에러 로깅
    console.error("[PRODUCT_PATCH] Error details:", {
      message: error.message,
      stack: error.stack,
      data: error,
    });

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
