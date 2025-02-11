"use client";

import { Subcategory } from "@prisma/client";
import Dropdown from "../common/Dropdown";
import { useEffect, useState } from "react";

interface SubCategorySelectProps {
  subCategories?: Subcategory[];
  setSubCategory?: (subcategory: string) => void;
}

const SubCategorySelect = ({
  subCategories,
  setSubCategory = () => {},
}: SubCategorySelectProps) => {
  const [selectedOption, setSelectedOption] = useState<string>(""); // 선택된 옵션 상태 추가

  useEffect(() => {
    setSelectedOption(subCategories?.[0]?.name as string);
  }, [subCategories]);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setSubCategory(option);
  };

  return (
    <Dropdown
      options={subCategories?.map(
        (subcategory: Subcategory) => subcategory.name
      )}
      selectedOption={selectedOption}
      onSelect={handleSelect}
    />
  );
};

export default SubCategorySelect;
