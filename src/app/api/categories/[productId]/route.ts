import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    if (!productId || typeof productId !== "string") {
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
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
