import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      user: true,
      replies: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;
  const { content } = await req.json();

  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const newComment = await prisma.comment.create({
    data: {
      content,
      postId,
      userId: currentUser?.id,
    },
  });

  return NextResponse.json(newComment);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;
  const { commentId, content } = await req.json();

  console.log({ content });

  if (!content?.trim()) {
    return NextResponse.json(
      { error: "댓글 내용을 입력해주세요." },
      { status: 400 }
    );
  }

  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingComment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!existingComment) {
    return NextResponse.json(
      { error: "댓글을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  // 댓글 작성자 확인
  if (existingComment.userId !== currentUser.id) {
    return NextResponse.json(
      { error: "댓글을 수정할 권한이 없습니다." },
      { status: 403 }
    );
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId, userId: currentUser?.id, postId },
    data: { content },
  });

  return NextResponse.json(updatedComment);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;
  const { commentId } = await req.json();

  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // 댓글 존재 여부 확인
  const existingComment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!existingComment) {
    return NextResponse.json(
      { error: "댓글을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  // 댓글 작성자 확인
  if (existingComment.userId !== currentUser.id) {
    return NextResponse.json(
      { error: "댓글을 삭제할 권한이 없습니다." },
      { status: 403 }
    );
  }

  await prisma.comment.delete({
    where: { id: commentId, userId: currentUser?.id, postId },
  });
  return NextResponse.json({ message: "Comment deleted" });
}
