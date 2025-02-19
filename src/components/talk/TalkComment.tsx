"use client";

import { useTalkComments } from "@/hooks/talk/useComments";
import CommentItem from "@/components/talk/CommentItem";
import ReplyItem from "@/components/talk/ReplyItem";
import ReplyInput from "@/components/talk/ReplyInput";

interface TalkCommentProps {
  postId: string;
}

const TalkComment = ({ postId }: TalkCommentProps) => {
  const { data: comments } = useTalkComments(postId);

  return (
    <section className="w-full">
      <h3 className="text-2xl font-bold border-b border-gray-200 pb-4">댓글</h3>
      {comments?.map((comment) => (
        <div key={comment.id}>
          <CommentItem key={comment.id} comment={comment} postId={postId} />
          <section className="w-full pl-10">
            {comment.replies.map((reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                postId={postId}
                commentId={comment.id}
              />
            ))}
            <ReplyInput commentId={comment.id} postId={postId} />
          </section>
        </div>
      ))}
    </section>
  );
};

export default TalkComment;
