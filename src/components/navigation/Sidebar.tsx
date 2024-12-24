"use client";

import { useSearchParams } from "next/navigation";
import { CATEGORY_TITLE } from "../categories/Categories";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Subcategory } from "@prisma/client";

const Sidebar = () => {
  const params = useSearchParams();
  const category = params?.get("category");

  const { data: subCategories } = useQuery({
    queryKey: ["sub-categories", category],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/categories/sub-categories?category=${category}`
      );
      return data;
    },
    enabled: !!category,
  });

  console.log(category);
  return (
    <div className="w-full md:w-1/4 py-5">
      <h3 className="text-xl font-bold hidden md:block">
        {CATEGORY_TITLE[category as string]}
      </h3>
      <ul className="flex gap-2 mt-1 md:mt-5 ml-2 md:flex-col w-full justify-center overflow-x-scroll md:overflow-x-auto">
        {subCategories?.map((subCategory: Subcategory) => (
          <li key={subCategory.id}>{subCategory.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
