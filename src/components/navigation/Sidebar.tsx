import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { CATEGORY_TITLE, CategoryType } from "@/constants/categories";
import SideBarSubCategories from "@/components/navigation/SideBarSubCategories";
import { prefetchSubCategories } from "@/hooks/category/useSubCategories";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

interface SidebarProps {
  category: CategoryType;
}

export const SidebarSkeleton = () => {
  return (
    <div className="w-full md:w-1/4 py-5">
      <Skeleton className="h-[30px] w-[60%] hidden md:block" />
      <div className="flex w-full gap-2 mt-1 md:mt-5 ml-2 md:flex-col justify-start overflow-x-scroll md:overflow-x-auto">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-[30px] md:h-[20px] w-full md:w-[40%] rounded-xl"
          />
        ))}
      </div>
    </div>
  );
};

const Sidebar = async ({ category }: SidebarProps) => {
  const queryClient = new QueryClient();

  await prefetchSubCategories(queryClient, category);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <aside className="w-full md:w-1/4 py-5" aria-label="서브 카테고리">
        <Link
          href={`/?category=${category}`}
          className="text-xl font-bold hidden md:block hover:text-gray-500 cursor-pointer transition-all duration-300"
        >
          {CATEGORY_TITLE[category]}
        </Link>
        <SideBarSubCategories category={category} />
      </aside>
    </HydrationBoundary>
  );
};

export default Sidebar;
