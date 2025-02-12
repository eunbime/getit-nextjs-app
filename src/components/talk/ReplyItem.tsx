import { useState } from "react";
import CommentBox from "./CommentBox";
import { TReplyWithUser } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

interface ReplyItemProps {
  reply: TReplyWithUser;
  postId: string;
  commentId: string;
}

const ReplyItem = ({ reply, postId, commentId }: ReplyItemProps) => {
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState(reply.content || "");

  const { mutate: updateReply } = useMutation({
    mutationFn: async (content: string) => {
      const { data: response } = await axios.put(
        `/api/talk/posts/${postId}/reply`,
        { content, commentId, replyId: reply.id }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["replies", postId, commentId],
      });
      toast.success("대댓글 수정 완료");
    },
  });

  const { mutate: deleteReply } = useMutation({
    mutationFn: async () => {
      const { data: response } = await axios.delete(
        `/api/talk/posts/${postId}/reply`,
        { data: { replyId: reply.id } }
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
      toast.success("대댓글 삭제 완료");
    },
  });

  const handleUpdateComment = () => {
    updateReply(replyContent);
    setIsEditing(false);
  };

  const handleDeleteComment = () => {
    deleteReply();
  };

  return (
    <div>
      <CommentBox
        key={reply.id}
        image={reply.user.image || ""}
        name={reply.user.name || ""}
        createdAt={reply.createdAt}
        isEditing={isEditing}
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        content={replyContent}
        setIsEditing={setIsEditing}
        handleUpdateComment={handleUpdateComment}
        handleDeleteComment={handleDeleteComment}
      />
    </div>
  );
};

export default ReplyItem;
