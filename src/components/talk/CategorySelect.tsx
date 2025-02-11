"use client";

import { TCategoryWithSubcategories } from "@/types";
import Dropdown from "@/components/common/Dropdown";
import { CATEGORY_TITLE, CategoryType } from "@/constants/categories";
import { useEffect } from "react";

interface CategorySelectProps {
  categories?: TCategoryWithSubcategories[];
  setSelectedCategory: (category: string) => void;
  setCategory?: (category: string) => void;
}

const CategorySelect = ({
  categories,
  setSelectedCategory,
  setCategory = () => {},
}: CategorySelectProps) => {
  useEffect(() => {
    setSelectedCategory("digital");
    setCategory?.("digital");
  }, []);

  const handleSelect = (option: string) => {
    setSelectedCategory(
      Object.keys(CATEGORY_TITLE).find(
        (key) => CATEGORY_TITLE[key as CategoryType] === option
      ) as CategoryType
    );
    setCategory?.(
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
        "디지털 기기" || CATEGORY_TITLE[categories?.[0].name as CategoryType]
      }
      onSelect={handleSelect}
    />
  );
};

export default CategorySelect;
