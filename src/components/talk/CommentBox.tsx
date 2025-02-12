import dayjs from "dayjs";
import Avatar from "../common/Avatar";

interface CommentBoxProps {
  image: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  content: string;
  createdAt: Date;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleUpdateComment: () => void;
  handleDeleteComment: () => void;
}

const CommentBox = ({
  image,
  name,
  value,
  onChange,
  content,
  createdAt,
  isEditing,
  setIsEditing,
  handleUpdateComment,
  handleDeleteComment,
}: CommentBoxProps) => {
  return (
    <div className="flex gap-10 p-4 items-center justify-between border-b border-gray-200">
      <div className="flex gap-10 items-center">
        <div className="flex flex-col gap-2 items-center">
          <Avatar src={image} />
          <p>{name}</p>
        </div>
        {isEditing ? (
          <input type="text" value={value} onChange={onChange} />
        ) : (
          <p>{content}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 items-end">
        <div className="flex gap-2 items-center">
          <p>{dayjs(createdAt).format("YYYY-MM-DD")}</p>
          <p>{dayjs(createdAt).format("HH:mm")}</p>
          {/* <p>추천</p> */}
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

export default CommentBox;
