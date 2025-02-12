import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string; commentId: string } }
) {
  const { postId } = params;
  const { content, commentId } = await req.json();
  console.log(content, commentId);

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    return NextResponse.json(
      { error: "댓글을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const reply = await prisma.reply.create({
    data: { content, commentId, postId, userId: currentUser.id },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  return NextResponse.json(reply);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;
  const { replyId, content, commentId } = await req.json();

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const reply = await prisma.reply.update({
    where: { id: replyId, postId, commentId, userId: currentUser.id },
    data: { content },
  });
  return NextResponse.json(reply);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;
  const { replyId } = await req.json();

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const reply = await prisma.reply.delete({
    where: { id: replyId, postId, userId: currentUser.id },
  });
  return NextResponse.json(reply);
}
