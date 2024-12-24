import prisma from "@/helpers/prismadb";

export default async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return {
      data: categories,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}
