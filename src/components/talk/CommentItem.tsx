import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { TCommentWithUserWithReplies } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CommentBox from "./CommentBox";
import { useUserStore } from "@/store/userStore";

interface CommentItemProps {
  comment: TCommentWithUserWithReplies;
  postId: string;
}

const CommentItem = ({ comment, postId }: CommentItemProps) => {
  const currentUser = useUserStore((state) => state.currentUser);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [commentContent, setCommentContent] = useState(comment?.content || "");

  const { mutate: deleteComment } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/talk/posts/${postId}/comments`,
        {
          data: {
            commentId: comment.id,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId, "comments"] });
      toast.success("댓글이 삭제되었습니다.");
    },
    onError: () => {
      toast.error("댓글 삭제에 실패했습니다.");
    },
  });

  const { mutate: updateComment } = useMutation({
    mutationFn: async (content: string) => {
      const { data } = await axios.put(`/api/talk/posts/${postId}/comments`, {
        commentId: comment.id,
        content,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId, "comments"] });
      toast.success("댓글이 수정되었습니다.");
    },
    onError: () => {
      toast.error("댓글 수정에 실패했습니다.");
    },
  });

  const handleDeleteComment = () => {
    deleteComment();
  };

  const handleUpdateComment = () => {
    if (!commentContent.trim()) {
      toast.error("댓글 내용을 입력해주세요.");
      return;
    }
    updateComment(commentContent);
    setIsEditing(false);
  };

  return (
    <CommentBox
      user={comment?.user}
      value={commentContent}
      onChange={(e) => setCommentContent(e.target.value)}
      content={comment?.content || ""}
      createdAt={comment?.createdAt || ""}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      handleUpdateComment={handleUpdateComment}
      handleDeleteComment={handleDeleteComment}
      isAuthor={currentUser?.id === comment?.user?.id}
    />
  );
};

export default CommentItem;
