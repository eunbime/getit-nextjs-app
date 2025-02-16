import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function POST(
  _: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { productId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.like.create({
      data: {
        userId: currentUser.id,
        productId: productId as string,
        likeCount: 1,
      },
    });

    return NextResponse.json({ success: true });
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

export async function DELETE(
  _: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { productId } = params;

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.like.deleteMany({
      where: {
        userId: currentUser.id,
        productId: productId as string,
      },
    });

    return NextResponse.json({ success: true });
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
