"use client";

import { useSearchParams } from "next/navigation";

import { CATEGORY_TITLE, CategoryType } from "@/constants/categories";
import SideBarSubCategories from "@/components/navigation/SideBarSubCategories";
import { useSubCategories } from "@/hooks/category/useSubCategories";

const Sidebar = () => {
  const params = useSearchParams();
  const category = params?.get("category");

  const {
    data: subCategories,
    isLoading,
    error,
  } = useSubCategories(category as CategoryType);

  if (error) {
    return (
      <div className="w-full md:w-1/4 py-5" role="alert">
        <div className="text-red-500">
          서브 카테고리를 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  return (
    <aside className="w-full md:w-1/4 py-5" aria-label="서브 카테고리">
      <h3 className="text-xl font-bold hidden md:block">
        {CATEGORY_TITLE[category as CategoryType]}
      </h3>
      <SideBarSubCategories
        subCategories={subCategories || []}
        category={category as string}
        isLoading={isLoading}
      />
    </aside>
  );
};

export default Sidebar;
