"use client";

import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Category } from "@prisma/client";

import CategoryBox from "./CategoryBox";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

export const CATEGORY_TITLE: { [key: string]: string } = {
  digital: "디지털 기기",
  appliances: "생활가전",
  interior: "가구/인테리어",
  "women-clothing": "여성의류",
  "men-clothing": "남성의류",
  accessories: "패션/잡화",
  beauty: "뷰티/미용",
  sports: "스포츠/헬스",
};

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/categories");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-row flex-wrap items-center justify-around overflow-x-auto">
        <Skeleton className="h-10 md:w-24 w-20 mb-2" />
        <Skeleton className="h-10 md:w-24 w-20 mb-2" />
        <Skeleton className="h-10 md:w-24 w-20 mb-2" />
        <Skeleton className="h-10 md:w-24 w-20 mb-2" />
        <Skeleton className="h-10 md:w-24 w-20 mb-2" />
        <Skeleton className="h-10 md:w-24 w-20 mb-2" />
        <Skeleton className="h-10 md:w-24 w-20 mb-2" />
      </div>
    );
  }

  return (
    <div className="flex flex-row flex-wrap items-center justify-around overflow-x-auto">
      {categories?.map((item: Category) => (
        <CategoryBox
          key={item.name}
          label={CATEGORY_TITLE[item.name] || item.name}
          path={item.name}
          selected={category === item.name}
        />
      ))}
    </div>
  );
};

export default Categories;
