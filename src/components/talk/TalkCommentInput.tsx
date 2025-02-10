const TalkCommentInput = () => {
  return (
    <form className="flex gap-2">
      <textarea className="w-full h-[100px] border border-gray-200 rounded-lg p-2" />
      <button className="bg-[#0d0c8f] w-20 text-white rounded-lg p-2">
        작성
      </button>
    </form>
  );
};

export default TalkCommentInput;
