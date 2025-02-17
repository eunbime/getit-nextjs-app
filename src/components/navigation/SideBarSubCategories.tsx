"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Subcategory } from "@prisma/client";
import { useSubCategories } from "@/hooks/category/useSubCategories";
import { CategoryType } from "@/constants/categories";

interface SideBarSubCategoriesProps {
  category: CategoryType;
}

const SideBarSubCategories = ({ category }: SideBarSubCategoriesProps) => {
  const searchParams = useSearchParams();
  const selectedSubCategory = searchParams?.get("subcategory");

  const { data: subCategories } = useSubCategories(category);

  return (
    <ul className="flex gap-2 mt-1 md:mt-5 ml-2 md:flex-col w-full justify-start overflow-x-scroll md:overflow-x-auto">
      {subCategories?.map((subCategory: Subcategory) => (
        <li
          key={subCategory.id}
          className="bg-gray-200 md:bg-transparent py-1 px-3 md:py-0 md:px-0 rounded-full md:rounded-none md:text-md md:font-semibold min-w-fit hover:text-gray-500 transition-all"
        >
          <Link
            href={`/?category=${category}&subcategory=${subCategory.id}`}
            className={`hover:border-b-2 hover:border-gray-300 ${
              selectedSubCategory === subCategory.id
                ? "border-b-2 border-gray-300"
                : "border-transparent"
            }`}
          >
            {subCategory.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SideBarSubCategories;
