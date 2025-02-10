"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Category } from "@prisma/client";
import TextEditor from "@/components/common/TextEditor";
import CategorySelect from "@/components/talk/CategorySelect";
import SubCategorySelect from "@/components/talk/SubCategorySelect";
import { useRouter } from "next/navigation";

export default function TalkWritePage() {
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const router = useRouter();

  const handleNavigation = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closestLink = target.closest("a");

      if (closestLink) {
        e.preventDefault();
        const confirmed = window.confirm("저장하지 않고 나가시겠습니까?");
        if (confirmed) {
          router.push(closestLink.getAttribute("href") || "/");
        }
      }
    },
    [router]
  );

  useEffect(() => {
    document.addEventListener("click", handleNavigation, true);

    return () => {
      document.removeEventListener("click", handleNavigation, true);
    };
  }, [handleNavigation]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/categories");
      return data;
    },
  });

  return (
    <div className="w-full h-full flex flex-col gap-5 p-10">
      <input
        title="title"
        className="outline-none focus:outline-none focus:ring-0 focus:border-gray-300 border-b-2 border-t-0 border-x-0 border-gray-300 rounded-none text-3xl font-bold p-2"
        placeholder="제목을 입력해주세요."
      />
      <div className="flex w-full md:w-1/2">
        <CategorySelect
          categories={categories}
          setSelectedCategory={setSelectedCategory}
        />
        <SubCategorySelect
          subCategories={
            categories?.find(
              (category: Category) => category.name === selectedCategory
            )?.subcategories
          }
        />
      </div>
      <TextEditor value={content} onChange={(value) => setContent(value)} />
      <button className="fixed bottom-10 right-10 bg-[#0d0c8f] text-xl font-bold text-white px-4 py-2 rounded-md">
        작성하기
      </button>
    </div>
  );
}
