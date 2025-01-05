import Container from "@/components/common/Container";
import ProductForm from "@/components/products/ProductForm";

const ProductUploadPage = () => {
  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <ProductForm />
      </div>
    </Container>
  );
};

export default ProductUploadPage;
