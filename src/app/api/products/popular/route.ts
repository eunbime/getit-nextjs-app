import { NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();

    const popularProducts = await Promise.all(
      categories.map(async (category) => {
        return prisma.product.findMany({
          where: {
            categoryId: category.id,
          },
          orderBy: {
            likes: {
              _count: "desc",
            },
          },
          include: {
            category: true,
            _count: {
              select: {
                likes: true,
              },
            },
          },
          take: 1,
        });
      })
    );

    const products = popularProducts.flat().filter(Boolean);

    return NextResponse.json(products);
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
