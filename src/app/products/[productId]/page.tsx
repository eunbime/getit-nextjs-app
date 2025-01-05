import ProductClient from "@/app/products/[productId]/ProductClient";

interface Params {
  productId?: string;
}

const ProductIdPage = async ({ params }: { params: Params }) => {
  const productId = params.productId;

  return <ProductClient productId={productId} />;
};

export default ProductIdPage;
