"use client";

import { useUserStore } from "@/store/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface TalkCommentInputProps {
  postId: string;
}

const TalkCommentInput = ({ postId }: TalkCommentInputProps) => {
  const { currentUser } = useUserStore();
  console.log({ currentUser });
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
    if (!currentUser) {
      toast.error("로그인 후 이용해주세요.");
      return;
    }
    toast.success("댓글 작성 완료");
    createComment(data);
    reset();
  };

  return (
    <form className="flex gap-2 mb-10" onSubmit={handleSubmit(onSubmit)}>
      <div className="relative w-full">
        <textarea
          className="w-full h-[100px] border border-gray-200 rounded-lg p-2"
          {...register("content", { required: "댓글을 입력해주세요." })}
        />
        {errors.content && (
          <p className="absolute -bottom-5 left-0 text-red-500 text-sm">
            {errors.content.message}
          </p>
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

export default TalkCommentInput;
