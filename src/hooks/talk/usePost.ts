import { TPostWithCategoryWithAuthor } from "@/types";
import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const prefetchTalkPost = async (
  queryClient: QueryClient,
  postId: string
) => {
  try {
    return queryClient.prefetchQuery({
      queryKey: ["post", postId],
      queryFn: async () => {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/talk/posts/${postId}`
        );
        return data;
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("토크 게시글을 불러오는 중 오류가 발생했습니다.");
  }
};

export const useTalkPost = (postId: string) => {
  try {
    return useQuery({
      queryKey: ["post", postId],
      queryFn: async () => {
        const { data } = await axios.get<TPostWithCategoryWithAuthor>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/talk/posts/${postId}`
        );
        return data;
      },
      enabled: !!postId,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("토크 게시글을 불러오는 중 오류가 발생했습니다.");
  }
};
