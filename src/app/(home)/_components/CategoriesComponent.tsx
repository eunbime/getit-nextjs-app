import Categories from "@/components/categories/Categories";
import CategorySkeleton from "@/components/categories/CategorySkeleton";
import { getCategories } from "@/hooks/api/useCategories";
import { Suspense } from "react";

export default async function CategoriesComponent() {
  const categories = await getCategories();

  return (
    <Suspense fallback={<CategorySkeleton />}>
      <Categories initialData={categories} />
    </Suspense>
  );
}
