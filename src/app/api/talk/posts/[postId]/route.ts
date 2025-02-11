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
