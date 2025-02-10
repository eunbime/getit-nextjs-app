const BoardListItem = () => {
  return (
    <li className="flex items-center justify-between p-4 border-b-2 border-gray-200">
      <div className="flex gap-10">
        <p className="w-[200px]">category / subcategory</p>
        <p>title</p>
      </div>
      <div className="flex gap-5">
        <p>author</p>
        <p>createdAt</p>
        <p>viewCount</p>
        <p>likeCount</p>
      </div>
    </li>
  );
};

export default BoardListItem;
