import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
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
        return new NextResponse(`${value} is required`, { status: 400 });
      }
    });

    const categoryRecord = await prisma.category.findFirst({
      where: {
        name: category,
      },
    });

    if (!categoryRecord) {
      return NextResponse.json(
        { error: `카테고리를 선택해주세요. ${category}` },
        { status: 400 }
      );
    }

    const subCategoryRecord = await prisma.subcategory.findFirst({
      where: {
        name: subCategory,
        categoryId: categoryRecord!.id,
      },
    });

    if (!subCategoryRecord) {
      console.log("4. Category not found for:", category);
      return NextResponse.json(
        { error: `세부 카테고리를 선택해주세요. ${subCategory}` },
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

    const product = await prisma.product.create({
      data: productData,
    });

    return NextResponse.json(product);
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategoryId = searchParams.get("subcategory");
    const latitude = searchParams.get("latitude");
    const longitude = searchParams.get("longitude");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const query: any = {};

    if (category) {
      query.category = {
        name: {
          equals: category,
        },
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

    // 전체 상품 수 조회
    const totalCount = await prisma.product.count({
      where: query,
    });

    const products = await prisma.product.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        subcategory: true,
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: products,
      currentPage: page,
      hasMore: skip + products.length < totalCount,
      totalCount,
    });
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
