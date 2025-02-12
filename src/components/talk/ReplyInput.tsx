"use client";

import { useUserStore } from "@/store/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface ReplyInputProps {
  postId: string;
  commentId: string;
}

const ReplyInput = ({ postId, commentId }: ReplyInputProps) => {
  const { currentUser } = useUserStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ content: string }>({
    defaultValues: {
      content: "",
    },
    mode: "onChange",
  });

  const { mutate: createReply } = useMutation({
    mutationFn: async (data: { content: string }) => {
      const { data: response } = await axios.post(
        `/api/talk/posts/${postId}/reply`,
        { content: data.content, commentId }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["replies", postId, commentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
      toast.success("대댓글 작성 완료");
    },
  });

  const onSubmit = (data: { content: string }) => {
    if (!currentUser) {
      toast.error("로그인 후 이용해주세요.");
      return;
    }
    createReply(data);
    reset();
  };

  return (
    <form className="flex w-full gap-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2 w-full">
        <textarea
          className="w-full h-[100px] border border-gray-200 rounded-lg p-2"
          {...register("content", { required: "댓글을 입력해주세요." })}
        />
        {errors.content && (
          <p className="text-red-500">{errors.content.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="bg-[#0d0c8f] w-20 text-white rounded-lg p-2"
      >
        작성
      </button>
    </form>
  );
};

export default ReplyInput;
