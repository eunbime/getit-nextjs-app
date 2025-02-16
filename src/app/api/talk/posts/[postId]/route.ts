import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function GET(
  _: NextRequest,
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
      author: true,
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
  _: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!existingPost) {
    return NextResponse.json(
      { error: "게시글을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return NextResponse.json({ message: "Post deleted" });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const { viewCount } = await req.json();

  const post = await prisma.post.update({
    where: { id: postId },
    data: { viewCount },
  });
  return NextResponse.json(post);
}
