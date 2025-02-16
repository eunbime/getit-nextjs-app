import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const usePostRecommend = (postId: string) => {
  try {
    return useQuery({
      queryKey: ["post", postId, "recommend"],
      queryFn: async () => {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/talk/posts/${postId}/recommend`
        );
        return data;
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("추천 버튼을 불러오는 중 오류가 발생했습니다.");
  }
};
