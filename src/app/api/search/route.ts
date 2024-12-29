import { NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");

  try {
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: keyword || "",
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
