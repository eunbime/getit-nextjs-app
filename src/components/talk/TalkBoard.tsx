"use client";

import { useQuery } from "@tanstack/react-query";
import BoardFilter from "./BoardFilter";
import BoardList from "./BoardList";
import PaginationWrapper from "./PaginationWrapper";
import axios from "axios";
import { TPostWithCategoryWithAuthor } from "@/types";
import { useSearchParams } from "next/navigation";

const TalkBoard = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category") || "all";
  const subCategoryParam = searchParams?.get("subcategory") || "전체";

  const { data: posts } = useQuery<TPostWithCategoryWithAuthor[]>({
    queryKey: ["talk-posts", categoryParam, subCategoryParam],
    queryFn: async () => {
      const { data } = await axios.get("/api/talk/posts", {
        params: {
          page: 1,
          limit: 10,
          sort: "createdAt",
          order: "desc",
          category: categoryParam,
          subcategory: subCategoryParam,
        },
      });
      return data;
    },
  });

  return (
    <div className="w-[80%] h-full rounded-md">
      <BoardFilter
        categoryParam={categoryParam as string}
        subCategoryParam={subCategoryParam as string}
      />
      <div className="flex w-full items-center justify-between p-4 text-gray-600 border-b-2 border-gray-200">
        <div className="flex gap-10">
          <p className="w-[200px]">카테고리 / 서브카테고리</p>
          <p>제목</p>
        </div>
        <div className="flex gap-5">
          <p>작성자</p>
          <p>작성일</p>
          <p>조회수</p>
          <p>좋아요</p>
        </div>
      </div>
      {posts?.map((post) => (
        <BoardList key={post.id} post={post} />
      ))}
      <PaginationWrapper />
    </div>
  );
};

export default TalkBoard;
