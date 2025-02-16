import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TCommentWithUserWithReplies } from "@/types";

export const prefetchTalkComments = async (
  queryClient: QueryClient,
  postId: string
) => {
  try {
    return queryClient.prefetchQuery<TCommentWithUserWithReplies[]>({
      queryKey: ["post", postId, "comments"],
      queryFn: async () => {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/talk/posts/${postId}/comments`
        );
        return data;
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("토크 댓글을 불러오는 중 오류가 발생했습니다.");
  }
};

export const useTalkComments = (postId: string) => {
  try {
    return useQuery<TCommentWithUserWithReplies[]>({
      queryKey: ["post", postId, "comments"],
      queryFn: async () => {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/talk/posts/${postId}/comments`
        );
        return data;
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("토크 댓글을 불러오는 중 오류가 발생했습니다.");
  }
};
