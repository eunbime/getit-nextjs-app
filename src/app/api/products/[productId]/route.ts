import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function GET(
  _: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        user: true,
        category: true,
        subcategory: true,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
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
    const { productId } = params;

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
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

export async function PATCH(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const data = await request.json();

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const category = await prisma.category.findFirst({
      where: { name: data.category },
    });

    const subCategory = await prisma.subcategory.findFirst({
      where: { name: data.subCategory, categoryId: category!.id },
    });

    if (!category || !subCategory) {
      return new NextResponse("Category or subCategory not found", {
        status: 400,
      });
    }

    const updatedData = {
      title: data.title,
      description: data.description,
      category: {
        connect: { id: category.id },
      },
      subcategory: {
        connect: { id: subCategory.id },
      },
      price: parseInt(data.price),
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      imageSrc: data.imageSrc,
    };

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updatedData,
      include: {
        category: true,
        subcategory: true,
      },
    });

    return NextResponse.json(updatedProduct);
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
