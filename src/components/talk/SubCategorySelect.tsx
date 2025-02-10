"use client";

import { Category, Subcategory } from "@prisma/client";
import Dropdown from "../common/Dropdown";

interface SubCategorySelectProps {
  subCategories?: Subcategory[];
  selectedCategory?: Category;
}

const SubCategorySelect = ({ subCategories }: SubCategorySelectProps) => {
  console.log(subCategories);
  console.log({ subCategories });
  return (
    <Dropdown
      options={subCategories?.map(
        (subcategory: Subcategory) => subcategory.name
      )}
      selectedOption={subCategories?.[0].name ?? "태블릿"}
    />
  );
};

export default SubCategorySelect;
