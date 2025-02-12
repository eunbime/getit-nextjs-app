"use client";

import { TCategoryWithSubcategories } from "@/types";
import { CATEGORY_TITLE, CategoryType } from "@/constants/categories";
import Dropdown from "@/components/common/Dropdown";

interface CategorySelectProps {
  categories?: TCategoryWithSubcategories[];
  setSelectedCategory: (category: string) => void;
  selectedCategory?: string;
  setCategory: (category: string) => void;
}

const CategorySelect = ({
  categories,
  setSelectedCategory,
  selectedCategory,
}: CategorySelectProps) => {
  const handleSelect = (option: string) => {
    const category = Object.keys(CATEGORY_TITLE).find(
      (key) => CATEGORY_TITLE[key as CategoryType] === option
    ) as CategoryType;

    if (category) {
      setSelectedCategory(category);
    }
  };

  return (
    <Dropdown
      options={categories?.map(
        (category) => CATEGORY_TITLE[category.name as CategoryType]
      )}
      selectedOption={
        CATEGORY_TITLE[selectedCategory as CategoryType] || "전체"
      }
      onSelect={handleSelect}
    />
  );
};

export default CategorySelect;
