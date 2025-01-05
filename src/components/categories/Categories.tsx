"use client";

import { useSearchParams } from "next/navigation";

import { Category } from "@prisma/client";
import { CATEGORY_TITLE, CategoryType } from "@/constants/categories";
import CategoryBox from "@/components/categories/CategoryBox";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/api/useCategories";

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");

  const { data: categories, isLoading, error } = useCategories();

  const categoryLength = categories?.length ?? 7;

  if (error) {
    console.error(error);
    return <div role="alert">카테고리를 불러오는데 실패했습니다.</div>;
  }

  if (isLoading) {
    return (
      <div
        className="flex flex-row flex-wrap items-center justify-around overflow-x-auto"
        role="tablist"
        aria-label="카테고리 로딩 중"
      >
        {Array.from({ length: categoryLength }).map((_, index) => (
          <Skeleton className="h-10 md:w-24 w-20 mb-2" key={index} />
        ))}
      </div>
    );
  }

  return (
    <nav
      className="flex flex-row flex-wrap items-center justify-around overflow-x-auto"
      role="tablist"
      aria-label="카테고리 목록"
    >
      {categories?.map((item: Category) => (
        <CategoryBox
          key={item.name}
          label={CATEGORY_TITLE[item.name as CategoryType] || item.name}
          path={item.name}
          selected={category === item.name}
        />
      ))}
    </nav>
  );
};

export default Categories;
