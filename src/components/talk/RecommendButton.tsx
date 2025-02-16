import { User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ThumbsUp, ThumbsUpIcon } from "lucide-react";
import { toast } from "react-toastify";
import { usePostRecommend } from "@/hooks/talk/useRecommend";

interface RecommendButtonProps {
  postId: string;
  currentUser: User | null;
}

const RecommendButton = ({ postId, currentUser }: RecommendButtonProps) => {
  const queryClient = useQueryClient();

  const { data: isRecommend } = usePostRecommend(postId);

  const { mutate: recommendPost } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.patch(`/api/talk/posts/${postId}/recommend`);
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["post", postId, "recommend"],
      });
      const previousRecommend = queryClient.getQueryData([
        "post",
        postId,
        "recommend",
      ]);
      queryClient.setQueryData(
        ["post", postId, "recommend"],
        !previousRecommend
      );
      return { previousRecommend };
    },
    onError: (err, variables, context) => {
      // 에러 시 롤백
      if (context?.previousRecommend !== undefined) {
        queryClient.setQueryData(
          ["post", postId, "recommend"],
          context.previousRecommend
        );
      }
    },
    onSettled: () => {
      toast.success("추천되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["post", postId, "recommend"],
      });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleRecommend = () => {
    if (!currentUser) {
      toast.error("로그인 후 이용해주세요.");
      return;
    }
    if (isRecommend) {
      toast.error("이미 추천하셨습니다.");
      return;
    }
    recommendPost();
  };

  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-full bg-gray-200 p-3 ${
        !!currentUser?.id === isRecommend ? "text-blue-500" : ""
      }`}
      onClick={handleRecommend}
    >
      {isRecommend ? <ThumbsUpIcon /> : <ThumbsUp />}
    </button>
  );
};

export default RecommendButton;
