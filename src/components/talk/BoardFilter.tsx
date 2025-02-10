"use client";

import BoardSearchInput from "@/components/talk/BoardSearchInput";
import CategorySelect from "@/components/talk/CategorySelect";
import SortSelect from "@/components/talk/SortSelect";
import SubCategorySelect from "@/components/talk/SubCategorySelect";
import { TCategoryWithSubcategories } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const BoardFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories } = useQuery<TCategoryWithSubcategories[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/categories`);
      return data;
    },
  });

  return (
    <section className="flex items-center justify-around py-3 px-6 bg-[#0d0c8f] text-white font-semibold rounded-md">
      <CategorySelect
        categories={categories}
        setSelectedCategory={setSelectedCategory}
      />
      <SubCategorySelect
        subCategories={
          categories?.find((category) => category.name === selectedCategory)
            ?.subcategories
        }
      />
      <SortSelect />
      <BoardSearchInput />
    </section>
  );
};

export default BoardFilter;
