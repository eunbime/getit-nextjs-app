"use client";

import BoardSearchInput from "@/components/talk/BoardSearchInput";
import CategorySelect from "@/components/talk/CategorySelect";
import SortSelect from "@/components/talk/SortSelect";
import SubCategorySelect from "@/components/talk/SubCategorySelect";
import { useQueryString } from "@/hooks/useQueryString";
import { TCategoryWithSubcategories } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

interface BoardFilterProps {
  categoryParam: string;
  subCategoryParam: string;
}

const BoardFilter = ({ categoryParam, subCategoryParam }: BoardFilterProps) => {
  const { updateQueryString } = useQueryString();

  const [subCategory, setSubCategory] = useState<string>(subCategoryParam);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(categoryParam);

  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSubCategory(subCategoryParam);
  }, [categoryParam, subCategoryParam]);

  const { data: categories } = useQuery<TCategoryWithSubcategories[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/categories`);
      return data;
    },
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSubCategory("전체");
    updateQueryString({
      category,
      subcategory: "전체",
    });
  };

  const handleSubCategoryChange = (subcategory: string) => {
    setSubCategory(subcategory);
    updateQueryString({
      category: selectedCategory,
      subcategory,
    });
  };

  return (
    <section className="flex items-center justify-around py-3 px-6 bg-[#0d0c8f] text-white font-semibold rounded-md">
      <CategorySelect
        categories={categories}
        setSelectedCategory={handleCategoryChange}
        selectedCategory={selectedCategory}
      />
      <SubCategorySelect
        subCategories={
          categories?.find((category) => category.name === selectedCategory)
            ?.subcategories
        }
        setSubCategory={handleSubCategoryChange}
        subCategory={subCategory}
      />
      <SortSelect />
      <BoardSearchInput />
    </section>
  );
};

export default BoardFilter;
