"use client";

import { TCategoryWithSubcategories } from "@/types";
import Dropdown from "@/components/common/Dropdown";
import { CATEGORY_TITLE, CategoryType } from "@/constants/categories";

interface CategorySelectProps {
  categories?: TCategoryWithSubcategories[];
  setSelectedCategory: (category: string) => void;
}

const CategorySelect = ({
  categories,
  setSelectedCategory,
}: CategorySelectProps) => {
  const handleSelect = (option: string) => {
    setSelectedCategory(
      Object.keys(CATEGORY_TITLE).find(
        (key) => CATEGORY_TITLE[key as CategoryType] === option
      ) as CategoryType
    );
  };

  return (
    <Dropdown
      options={categories?.map(
        (category) => CATEGORY_TITLE[category.name as CategoryType]
      )}
      selectedOption={
        CATEGORY_TITLE[categories?.[0].name as CategoryType] ?? "디지털 기기"
      }
      onSelect={handleSelect}
    />
  );
};

export default CategorySelect;
