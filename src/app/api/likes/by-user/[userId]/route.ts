import { NextRequest, NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/helpers/prismadb";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const likes = await prisma.like.findMany({
      where: {
        userId: currentUser.id,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(likes);
  } catch (error) {
    console.error("[FAVORITES_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get("productId");

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const like = await prisma.like.create({
    data: {
      userId: currentUser.id,
      productId: productId as string,
    },
  });

  return NextResponse.json(like);
}

export async function DELETE(request: NextRequest) {
  const currentUser = await getCurrentUser();

  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get("productId");

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const like = await prisma.like.deleteMany({
    where: {
      userId: currentUser.id,
      productId: productId as string,
    },
  });

  return NextResponse.json(like);
}
