import getCurrentUser from "../actions/getCurrentUser";
import getProducts, { ProductsParams } from "../actions/getProducts";

interface HomeProps {
  searchParams: ProductsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const products = await getProducts(searchParams);
  const currentUser = await getCurrentUser();

  return <main>everyone</main>;
}
