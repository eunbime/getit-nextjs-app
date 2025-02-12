"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import BoardFilter from "./BoardFilter";
import BoardList from "./BoardList";
import PaginationWrapper from "./PaginationWrapper";
import { TPostWithCategoryWithAuthor } from "@/types";

const TalkBoard = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category") || "all";
  const subCategoryParam = searchParams?.get("subcategory") || "전체";
  const [currentPage, setCurrentPage] = useState(1);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["talk-posts", categoryParam, subCategoryParam],
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await axios.get("/api/talk/posts", {
          params: {
            page: pageParam,
            limit: 20,
            sort: "createdAt",
            order: "desc",
            category: categoryParam,
            subcategory: subCategoryParam,
          },
        });
        return data;
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage.hasNextPage) return undefined;
        return lastPage.currentPage + 1;
      },
      initialPageParam: 1,
    });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (!data) return;

    const pageToFetch = page - data.pages.length;
    if (pageToFetch > 0) {
      for (let i = 0; i < pageToFetch; i++) {
        fetchNextPage();
      }
    }
  };

  // 현재 페이지의 게시물 목록
  const currentPosts = data?.pages[currentPage - 1]?.posts || [];
  // 전체 페이지 수
  const totalPages = data?.pages[0]?.totalPages || 0;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-[80%] h-full rounded-md">
      <BoardFilter
        categoryParam={categoryParam}
        subCategoryParam={subCategoryParam}
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
      {currentPosts.map((post: TPostWithCategoryWithAuthor) => (
        <BoardList key={post.id} post={post} />
      ))}
      {totalPages > 0 && (
        <PaginationWrapper
          page={currentPage}
          setPage={handlePageChange}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
      {isFetchingNextPage && <div>Loading more...</div>}
    </div>
  );
};

export default TalkBoard;
