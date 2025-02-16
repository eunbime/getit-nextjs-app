import { NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    if (!searchParams) {
      return new NextResponse("No search params", { status: 400 });
    }

    const limit = Number(searchParams.get("limit")) || 10;
    const page = Number(searchParams.get("page")) || 1;

    const posts = await prisma.product.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(posts);
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
