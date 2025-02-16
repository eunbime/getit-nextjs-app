import { NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryName = searchParams.get("category");

    const category = await prisma.category.findFirst({
      where: {
        name: categoryName as string,
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const subCategories = await prisma.subcategory.findMany({
      where: {
        categoryId: category.id,
      },
    });

    return NextResponse.json(subCategories);
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
