import { TCommentWithUserWithReplies } from "@/types";
import Avatar from "../common/Avatar";
import dayjs from "dayjs";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

interface CommentItemProps {
  comment: TCommentWithUserWithReplies;
  postId: string;
}

const CommentItem = ({ comment, postId }: CommentItemProps) => {
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
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
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
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
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
    <div className="flex gap-10 py-4 items-center justify-between border-b border-gray-200">
      <div className="flex gap-10 items-center">
        <div className="flex flex-col gap-2 items-center">
          <Avatar src={comment?.user?.image || ""} />
          <p>{comment?.user?.name || ""}</p>
        </div>
        {isEditing ? (
          <input
            type="text"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
        ) : (
          <p>{comment?.content || ""}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 items-end">
        <div className="flex gap-2 items-center">
          <p>{dayjs(comment?.createdAt).format("YYYY-MM-DD")}</p>
          <p>{dayjs(comment?.createdAt).format("HH:mm")}</p>
          <p>추천</p>
        </div>
        <div className="flex gap-2 items-center">
          {isEditing ? (
            <>
              <button onClick={handleUpdateComment}>완료</button>
              <button onClick={() => setIsEditing(false)}>취소</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)}>수정</button>
              <button onClick={handleDeleteComment}>삭제</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
