import dayjs from "dayjs";
import Avatar from "../common/Avatar";
import { User } from "@prisma/client";

interface CommentBoxProps {
  user: User;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  content: string;
  createdAt: Date;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleUpdateComment: () => void;
  handleDeleteComment: () => void;
  isAuthor: boolean;
}

const CommentBox = ({
  user,
  value,
  onChange,
  content,
  createdAt,
  isEditing,
  setIsEditing,
  handleUpdateComment,
  handleDeleteComment,
  isAuthor,
}: CommentBoxProps) => {
  return (
    <div className="flex flex-col w-full md:flex-row gap-2 md:gap-5 p-4 items-start md:items-center justify-start md:justify-between border-b border-gray-200">
      <div className="flex gap-10 items-start w-full">
        <div className="flex flex-col gap-2 items-center">
          <Avatar src={user.image || ""} user={user} />
          <p>{user.name}</p>
        </div>
        {isEditing ? (
          <textarea
            className="w-full"
            value={value}
            onChange={onChange}
            rows={3}
            maxLength={500}
          />
        ) : (
          <p className="pt-2 break-all">{content}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 items-end w-full md:w-auto text-sm text-gray-500 shrink-0">
        <div className="flex gap-2 items-center">
          <p>{dayjs(createdAt).format("YYYY-MM-DD")}</p>
          <p>{dayjs(createdAt).format("HH:mm")}</p>
          {/* <p>추천</p> */}
        </div>
        {isAuthor && (
          <div className="flex gap-2 items-center">
            {isEditing ? (
              <>
                <button
                  className="bg-white rounded-md p-1 hover:opacity-80"
                  onClick={handleUpdateComment}
                >
                  완료
                </button>
                <button
                  className="bg-white rounded-md p-1 hover:opacity-80"
                  onClick={() => setIsEditing(false)}
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-white rounded-md p-1 hover:opacity-80"
                  onClick={() => setIsEditing(true)}
                >
                  수정
                </button>
                <button
                  className="bg-white rounded-md p-1 hover:opacity-80"
                  onClick={handleDeleteComment}
                >
                  삭제
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentBox;
