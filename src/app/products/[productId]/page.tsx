import getCurrentUser from "@/app/actions/getCurrentUser";
import ProductClient from "@/app/products/[productId]/ProductClient";

interface Params {
  productId?: string;
}

const ProductIdPage = async ({ params }: { params: Params }) => {
  const currentUser = await getCurrentUser();
  const productId = params.productId;

  return <ProductClient productId={productId} currentUser={currentUser} />;
};

export default ProductIdPage;
