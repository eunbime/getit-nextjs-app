import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      subcategory: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const { title, content, category, subcategory } = await req.json();

  const categoryId = await prisma.category.findFirst({
    where: { name: category },
  });

  const subcategoryId = await prisma.subcategory.findFirst({
    where: { name: subcategory },
  });

  if (!categoryId || !subcategoryId) {
    return NextResponse.json(
      { error: "Category or subcategory not found" },
      { status: 404 }
    );
  }

  const post = await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      content,
      categoryId: categoryId.id,
      subcategoryId: subcategoryId.id,
    },
  });
  return NextResponse.json(post);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  await prisma.post.delete({ where: { id: postId } });
  return NextResponse.json({ message: "Post deleted" });
}
