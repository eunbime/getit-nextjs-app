import Avatar from "../common/Avatar";

const TalkComment = () => {
  return (
    <section className="w-full bg-gray-100 rounded-lg p-4">
      <h3 className="text-2xl font-bold border-b border-gray-200 pb-4">댓글</h3>
      <div className="flex gap-10 py-4 items-center justify-between border-b border-gray-200">
        <div className="flex gap-10 items-center">
          <div className="flex flex-col gap-2 items-center">
            <Avatar src={""} />
            <p>작성자</p>
          </div>
          <p>댓글 내용</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-2 items-center">
            <p>2025-02-10</p>
            <p>12:00</p>
            <p>추천</p>
          </div>
          <div className="flex gap-2 items-center">
            <button>수정</button>
            <button>삭제</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TalkComment;
