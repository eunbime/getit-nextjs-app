import axios from "axios";
import { QueryClient, useInfiniteQuery } from "@tanstack/react-query";

export const prefetchTalkPosts = async (queryClient: QueryClient) => {
  try {
    return queryClient.prefetchInfiniteQuery({
      queryKey: ["posts", "all", "전체", "createdAt", "desc", ""],
      queryFn: async ({ pageParam = 1 }) => {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/talk/posts`,
          {
            params: {
              page: pageParam,
              limit: 20,
              sort: "createdAt",
              order: "desc",
              category: "all",
              subcategory: "전체",
            },
            headers: {
              "Cache-Control": "no-store",
            },
          }
        );
        return data;
      },
      initialPageParam: 1,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("토크 게시글을 불러오는 중 오류가 발생했습니다.");
  }
};

export const useTalkPosts = (
  categoryParam: string,
  subCategoryParam: string,
  selectedSort: string,
  selectOrder: string,
  keyword: string
) => {
  try {
    return useInfiniteQuery({
      queryKey: [
        "posts",
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
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("토크 게시글을 불러오는 중 오류가 발생했습니다.");
  }
};
