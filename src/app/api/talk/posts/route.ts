import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET() {
  const posts = await prisma.post.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  try {
    const { title, content, category, subcategory } = await req.json();

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 먼저 카테고리와 서브카테고리의 ID를 찾습니다
    const categoryData = await prisma.category.findFirst({
      where: { name: category },
      select: { id: true },
    });

    const subcategoryData = await prisma.subcategory.findFirst({
      where: {
        name: subcategory,
        categoryId: categoryData?.id,
      },
      select: { id: true },
    });

    if (!categoryData || !subcategoryData) {
      return NextResponse.json(
        { error: "카테고리를 찾을 수 없습니다." },
        { status: 400 }
      );
    }

    console.log(categoryData, subcategoryData);

    const post = await prisma.post.create({
      data: {
        title,
        content,
        categoryId: categoryData.id,
        subcategoryId: subcategoryData.id,
        authorId: currentUser.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
