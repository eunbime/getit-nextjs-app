import getCurrentUser from "@/app/actions/getCurrentUser";
import getProductById from "@/app/actions/getProductById";
import EmptyState from "@/components/EmptyState";
import ProductClient from "./ProductClient";

interface Params {
  productId?: string;
}

const ProductIdPage = async ({ params }: { params: Params }) => {
  const product = await getProductById(params);
  const currentUser = await getCurrentUser();

  console.log(params.productId);

  if (!product) {
    return <EmptyState />;
  }

  return <ProductClient product={product} currentUser={currentUser} />;
};

export default ProductIdPage;
