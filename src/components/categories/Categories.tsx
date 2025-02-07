"use client";

import { useSearchParams } from "next/navigation";

import { Category } from "@prisma/client";
import { CATEGORY_TITLE, CategoryType } from "@/constants/categories";
import CategoryBox from "@/components/categories/CategoryBox";

const Categories = ({ initialData }: { initialData: Category[] }) => {
  const params = useSearchParams();
  const category = params?.get("category");

  return (
    <nav
      className="flex flex-row flex-wrap items-center justify-around overflow-x-auto mt-16"
      role="tablist"
      aria-label="카테고리 목록"
    >
      {initialData?.map((item: Category) => (
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
