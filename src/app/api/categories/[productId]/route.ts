import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function GET(
  _: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    if (!productId || typeof productId !== "string") {
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
    if (error instanceof Error) {
      return new NextResponse("Internal Error", {
        status: 500,
        statusText: error.message,
      });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
