import prisma from "@/helpers/prismadb";

export default async function getProductsByUserId(userId: string) {
  const products = await prisma.product.findMany({
    where: { userId },
  });

  return products;
}
