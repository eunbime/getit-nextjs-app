"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Avatar from "../common/Avatar";
import parse from "html-react-parser";

const TalkPostContent = ({ postId }: { postId: string }) => {
  const { data: post } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/talk/posts/${postId}`);
      return data;
    },
    gcTime: 1000 * 60 * 5, // 5분간 캐시 유지
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!postId,
  });

  return (
    <section className="w-full h-full">
      <div className="flex flex-col gap-2 border-b border-gray-200 pb-2">
        <h3 className="text-3xl font-bold ">{post?.title}</h3>
        <span className="text-gray-500">
          {post?.category.name} / {post?.subcategory.name}
        </span>
      </div>
      <div className="py-4 border-b border-gray-200 min-h-[300px]">
        {parse(post?.content || "")}
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-200">
        <div className="flex gap-2 items-center">
          <Avatar src={post?.author.image} />
          <p>{post?.author.name}</p>
        </div>
        <div className="flex gap-2">
          <p>{post?.createdAt}</p>
          <p>{post?.views}</p>
          <p>{post?.likes}</p>
        </div>
      </div>
    </section>
  );
};

export default TalkPostContent;
