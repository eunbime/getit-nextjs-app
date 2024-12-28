interface ProductCategoryProps {
  label: string;
  description: string;
  subCategory: string;
}

const ProductCategory = ({
  label,
  description,
  subCategory,
}: ProductCategoryProps) => {
  return (
    <div className="flex flex-col gap-6 ml-4">
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-col">
          <div className="text-lg font-semibold">{label}</div>
          <div className="font-light text-neutral-500">{description}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-lg font-semibold text-gray-500">
            {subCategory}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
