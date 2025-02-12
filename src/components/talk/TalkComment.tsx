"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TCommentWithUserWithReplies } from "@/types";
import CommentItem from "./CommentItem";
import ReplyItem from "./ReplyItem";
import ReplyInput from "./ReplyInput";

interface TalkCommentProps {
  postId: string;
}

const TalkComment = ({ postId }: TalkCommentProps) => {
  const { data: comments } = useQuery<TCommentWithUserWithReplies[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/talk/posts/${postId}/comments`);
      return data;
    },
  });
  return (
    <section className="w-full bg-gray-100 rounded-lg p-4">
      <h3 className="text-2xl font-bold border-b border-gray-200 pb-4">댓글</h3>
      {comments?.map((comment) => (
        <div key={comment.id}>
          <CommentItem key={comment.id} comment={comment} postId={postId} />
          <section className="w-full pl-20">
            <div className="bg-white">
              {comment.replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  postId={postId}
                  commentId={comment.id}
                />
              ))}
              <ReplyInput commentId={comment.id} postId={postId} />
            </div>
          </section>
        </div>
      ))}
    </section>
  );
};

export default TalkComment;
