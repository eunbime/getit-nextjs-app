import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { productId } = params;

    console.log({ productId });

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { productId } = params;

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.like.deleteMany({
      where: {
        userId: currentUser.id,
        productId: productId as string,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
