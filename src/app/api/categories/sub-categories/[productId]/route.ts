import prisma from "@/helpers/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    if (!productId || typeof productId !== "string") {
      return new NextResponse("Invalid Product ID", { status: 400 });
    }

    const subCategories = await prisma.subcategory.findMany({
      where: {
        products: {
          some: {
            id: productId,
          },
        },
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
