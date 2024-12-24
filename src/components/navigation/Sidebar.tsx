"use client";

import { useSearchParams } from "next/navigation";
import { CATEGORY_TITLE } from "../categories/Categories";

const Sidebar = () => {
  const params = useSearchParams();
  const category = params?.get("category");

  console.log(category);
  return (
    <div className="w-full md:w-1/4 py-5">
      <h3 className="text-xl font-bold hidden md:block">
        {CATEGORY_TITLE[category as string]}
      </h3>
      <ul className="flex gap-2 mt-1 md:mt-5 ml-2 md:flex-col w-full justify-center overflow-x-scroll md:overflow-x-auto">
        <li>subcategory</li>
        <li>subcategory</li>
        <li>subcategory</li>
        <li>subcategory</li>
        <li>subcategory</li>
      </ul>
    </div>
  );
};

export default Sidebar;
