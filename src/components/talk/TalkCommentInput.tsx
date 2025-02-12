"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface TalkCommentInputProps {
  postId: string;
}

const TalkCommentInput = ({ postId }: TalkCommentInputProps) => {
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

  const { mutate: createComment } = useMutation({
    mutationFn: async (data: { content: string }) => {
      const { data: response } = await axios.post(
        `/api/talk/posts/${postId}/comments`,
        { content: data.content }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const onSubmit = (data: { content: string }) => {
    toast.success("댓글 작성 완료");
    createComment(data);
    reset();
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit(onSubmit)}>
      <textarea
        className="w-full h-[100px] border border-gray-200 rounded-lg p-2"
        {...register("content", { required: "댓글을 입력해주세요." })}
      />
      <button
        type="submit"
        className="bg-[#0d0c8f] w-20 text-white rounded-lg p-2"
      >
        작성
      </button>
    </form>
  );
};

export default TalkCommentInput;
