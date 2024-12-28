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
      subCategory,
      category,
      latitude,
      longitude,
      price,
    } = body;

    Object.keys(body).forEach((value: any) => {
      if (!body[value]) {
        return NextResponse.json(
          { error: `${value} is required` },
          { status: 400 }
        );
      }
    });

    const categoryRecord = await prisma.category.findFirst({
      where: {
        name: category,
      },
    });

    if (!categoryRecord) {
      return NextResponse.json(
        { error: `Category not found: ${category}` },
        { status: 400 }
      );
    }

    // 서브카테고리 찾기
    const subCategoryRecord = await prisma.subcategory.findFirst({
      where: {
        name: subCategory,
        categoryId: categoryRecord!.id,
      },
    });

    if (!subCategoryRecord) {
      console.log("4. Category not found for:", category);
      return NextResponse.json(
        { error: `Subcategory not found: ${subCategory}` },
        { status: 400 }
      );
    }

    // 상품 생성
    const productData = {
      title,
      description,
      imageSrc,
      categoryId: categoryRecord.id,
      subcategoryId: subCategoryRecord.id,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      price: parseInt(price),
      userId: currentUser.id,
    };
    console.log("Creating product with data:", productData); // 생성할 상품 데이터 확인

    const product = await prisma.product.create({
      data: productData,
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("[PRODUCTS_POST] Detailed error:", error); // 자세한 에러 로깅
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategoryId = searchParams.get("subcategory");
    const latitude = searchParams.get("latitude");
    const longitude = searchParams.get("longitude");

    const query: any = {};

    if (category) {
      query.category = {
        name: category,
      };
    }

    if (subcategoryId) {
      query.subcategory = {
        id: subcategoryId,
      };
    }

    if (latitude) {
      query.latitude = {
        gte: Number(latitude) - 0.01,
        lte: Number(latitude) + 0.01,
      };
    }

    if (longitude) {
      query.longitude = {
        gte: Number(longitude) - 0.01,
        lte: Number(longitude) + 0.01,
      };
    }

    const products = await prisma.product.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        subcategory: true,
      },
    });

    return NextResponse.json({ data: products });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
