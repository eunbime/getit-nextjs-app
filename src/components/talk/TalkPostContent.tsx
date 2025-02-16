"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";

import { useTalkPost } from "@/hooks/talk/usePost";
import { useUserStore } from "@/store/userStore";
import { CATEGORY_TITLE, CategoryType } from "@/constants/categories";
import Avatar from "@/components/common/Avatar";
import RecommendButton from "@/components/talk/RecommendButton";
import { toast } from "react-toastify";

const TalkPostContent = ({ postId }: { postId: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUser = useUserStore((state) => state.currentUser);
  const { data: post } = useTalkPost(postId);

  const { mutate: deletePost } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/talk/posts/${postId}`);
    },
    onSuccess: () => {
      router.push("/talk");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      toast.error("게시글 삭제 중 오류가 발생했습니다.");
      throw new Error("게시글 삭제 중 오류가 발생했습니다.");
    },
  });

  return (
    <section className="w-full h-full">
      <div className="flex flex-col w-full gap-2 border-b border-gray-200 pb-2">
        <h3 className="text-xl md:text-3xl font-bold break-all">
          {post?.title}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm md:text-base">
            {CATEGORY_TITLE[post?.category.name as CategoryType]} /{" "}
            {post?.subcategory.name}
          </span>
          {currentUser?.id === post?.authorId && (
            <div className="flex gap-2">
              <button
                className="hover:opacity-70"
                onClick={() => router.push(`/talk/write/?postId=${post?.id}`)}
              >
                수정
              </button>
              <button
                className="hover:opacity-70"
                onClick={() => {
                  if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
                    deletePost();
                  }
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col justify-between py-4 border-b border-gray-200 min-h-[300px]">
        <div className="h-full w-full break-all">
          {parse(post?.content || "")}
        </div>
        <div className="flex items-center justify-end pt-4">
          <RecommendButton currentUser={currentUser} postId={post?.id || ""} />
        </div>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-200">
        <div className="flex gap-2 items-center">
          <Avatar src={post?.author.image} user={post?.author} />
          <p>{post?.author.name}</p>
        </div>
        <div className="flex gap-2 text-sm md:text-base">
          <p>작성일: {dayjs(post?.createdAt).format("YYYY-MM-DD")}</p>
          <p>조회수: {post?.viewCount}</p>
          <p>추천: {post?.recommendCount}</p>
        </div>
      </div>
    </section>
  );
};

export default TalkPostContent;
