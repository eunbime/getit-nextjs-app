import prisma from "@/helpers/prismadb";

export const getProductsByKeyword = async (keyword: string) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: keyword,
        },
      },
    });

    return products;
  } catch (error) {
    console.log(error);
    return [];
  }
};
