import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ThumbsUp, ThumbsUpIcon } from "lucide-react";
import { toast } from "react-toastify";

interface RecommendButtonProps {
  postId: string;
}

const RecommendButton = ({ postId }: RecommendButtonProps) => {
  const queryClient = useQueryClient();

  const { data: isRecommend } = useQuery({
    queryKey: ["recommend", postId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/talk/posts/${postId}/recommend`);
      return data;
    },
  });

  const { mutate: recommendPost } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.patch(`/api/talk/posts/${postId}/recommend`);
      return data;
    },
    onMutate: async () => {
      // 낙관적 업데이트
      await queryClient.cancelQueries({ queryKey: ["recommend", postId] });
      const previousRecommend = queryClient.getQueryData(["recommend", postId]);
      queryClient.setQueryData(["recommend", postId], !previousRecommend);
      return { previousRecommend };
    },
    onError: (err, variables, context) => {
      // 에러 시 롤백
      if (context?.previousRecommend !== undefined) {
        queryClient.setQueryData(
          ["recommend", postId],
          context.previousRecommend
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["recommend", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["talk-posts"] });
    },
  });

  const handleRecommend = () => {
    if (isRecommend) {
      toast.error("이미 추천하셨습니다.");
      return;
    }
    toast.success("추천되었습니다.");
    recommendPost();
  };

  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-full bg-gray-200 p-3 ${
        isRecommend ? "text-blue-500" : ""
      }`}
      onClick={handleRecommend}
    >
      {isRecommend ? <ThumbsUpIcon /> : <ThumbsUp />}
    </button>
  );
};

export default RecommendButton;
