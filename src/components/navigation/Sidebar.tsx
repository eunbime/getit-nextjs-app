"use client";

import { useSearchParams } from "next/navigation";
import { CATEGORY_TITLE } from "../categories/Categories";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Subcategory } from "@prisma/client";
import Link from "next/link";
import SideBarSubCategories from "./SideBarSubCategories";

const Sidebar = () => {
  const params = useSearchParams();
  const category = params?.get("category");

  const { data: subCategories, isLoading } = useQuery({
    queryKey: ["sub-categories", category],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/categories/sub-categories?category=${category}`
      );
      return data;
    },
    enabled: !!category,
  });

  return (
    <div className="w-full md:w-1/4 py-5">
      <h3 className="text-xl font-bold hidden md:block">
        {CATEGORY_TITLE[category as string]}
      </h3>
      <SideBarSubCategories
        subCategories={subCategories}
        category={category as string}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Sidebar;
