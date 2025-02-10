import BoardListItem from "./BoardListItem";

const BoardList = () => {
  return (
    <section className="w-full h-full">
      <ul className="w-full h-full flex flex-col">
        <BoardListItem />
        <BoardListItem />
        <BoardListItem />
        <BoardListItem />
        <BoardListItem />
        <BoardListItem />
        <BoardListItem />
      </ul>
    </section>
  );
};

export default BoardList;
