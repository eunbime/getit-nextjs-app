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
  setSelectOrder: (order: string) => void;
  setSelectedSort: (sort: string) => void;
  setKeyword: (keyword: string) => void;
}

const BoardFilter = ({
  categoryParam,
  subCategoryParam,
  setSelectOrder,
  setSelectedSort,
  setKeyword,
}: BoardFilterProps) => {
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

  const handleReset = () => {
    setSelectedCategory("all");
    setSubCategory("전체");
    updateQueryString({
      category: "all",
      subcategory: "전체",
    });
    setKeyword("");
    setSelectOrder("desc");
    setSelectedSort("createdAt");
  };

  return (
    <section className="flex flex-col w-full md:flex-row items-center justify-between gap-5 md:gap-10 py-3 px-6 bg-main-blue text-white font-semibold rounded-md">
      <div className="flex item-center justify-around shrink-0">
        <div className="w-full flex items-center gap-10 ">
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
          <SortSelect
            setSelectOrder={setSelectOrder}
            setSelectedSort={setSelectedSort}
          />
        </div>
      </div>
      <div className="flex items-center gap-5 w-full md:max-w-[400px] justify-between">
        <BoardSearchInput setKeyword={setKeyword} />

        <button
          className="w-20 h-7 bg-white text-black rounded-md hover:bg-gray-200 transition-all duration-300"
          onClick={handleReset}
        >
          초기화
        </button>
      </div>
    </section>
  );
};

export default BoardFilter;
