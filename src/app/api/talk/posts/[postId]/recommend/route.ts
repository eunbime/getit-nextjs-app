import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const currentUser = await getCurrentUser();
  const { postId } = params;

  const recommend = await prisma.recommend.findFirst({
    where: { postId: postId, userId: currentUser?.id },
  });

  console.log({ recommend });

  const isRecommend = !!recommend;

  return NextResponse.json(isRecommend);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const currentUser = await getCurrentUser();
  const { postId } = params;

  if (!currentUser?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recommend = await prisma.recommend.create({
    data: { postId: postId, userId: currentUser?.id },
  });

  const post = await prisma.post.update({
    where: { id: postId },
    data: {
      recommendCount: { increment: 1 },
    },
  });

  return NextResponse.json(post);
}
