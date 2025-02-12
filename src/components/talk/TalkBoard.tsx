"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import BoardFilter from "./BoardFilter";
import BoardList from "./BoardList";
import PaginationWrapper from "./PaginationWrapper";
import { TPostWithCategoryWithAuthor } from "@/types";
import { Skeleton } from "../ui/skeleton";

const TalkBoard = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category") || "all";
  const subCategoryParam = searchParams?.get("subcategory") || "전체";
  const [currentPage, setCurrentPage] = useState(1);
  const [selectOrder, setSelectOrder] = useState<string>("desc");
  const [selectedSort, setSelectedSort] = useState<string>("createdAt");
  const [keyword, setKeyword] = useState<string>("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [
        "talk-posts",
        categoryParam,
        subCategoryParam,
        selectedSort,
        selectOrder,
        keyword,
      ],
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await axios.get("/api/talk/posts", {
          params: {
            page: pageParam,
            limit: 20,
            sort: selectedSort,
            order: selectOrder,
            category: categoryParam,
            subcategory: subCategoryParam,
            keyword: keyword,
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

  return (
    <div className="w-full h-full rounded-md">
      <BoardFilter
        categoryParam={categoryParam}
        subCategoryParam={subCategoryParam}
        setSelectOrder={setSelectOrder}
        setSelectedSort={setSelectedSort}
        setKeyword={setKeyword}
      />
      <div className="flex w-full items-center justify-between p-4 pt-10 text-gray-600 border-b-2 border-gray-200 text-xs md:text-base">
        <div className="flex gap-8 md:gap-10">
          <p className="w-[120px] md:w-[200px]">카테고리 / 서브카테고리</p>
          <p>제목</p>
        </div>
        <div className="flex gap-2 md:gap-5">
          <p>작성자</p>
          <p>작성일</p>
          <p>조회수</p>
          <p>추천수</p>
        </div>
      </div>
      {isLoading ? (
        <div className="w-full h-full flex flex-col gap-[2px]">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-[58px]" />
          ))}
        </div>
      ) : (
        currentPosts.map((post: TPostWithCategoryWithAuthor) => (
          <BoardList key={post.id} post={post} />
        ))
      )}
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
