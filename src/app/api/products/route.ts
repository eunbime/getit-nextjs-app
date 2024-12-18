import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    const body = await request.json();

    const {
      title,
      description,
      imageSrc,
      category,
      latitude,
      longitude,
      price,
    } = body;

    Object.keys(body).forEach((value: any) => {
      if (!body[value]) {
        return NextResponse.json(
          { error: `${value} is required` },
          { status: 400 }
        );
      }
    });

    const product = await prisma.product.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        latitude,
        longitude,
        price: Number(price),
        userId: currentUser.id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
  }
}
