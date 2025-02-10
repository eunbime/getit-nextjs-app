import { IoSearch } from "react-icons/io5";

const BoardSearchInput = () => {
  return (
    <form className="flex items-center gap-2 ">
      <input
        type="text"
        placeholder="검색"
        className="outline-none border-none py-1 px-2"
      />
      <button type="submit">
        <IoSearch />
      </button>
    </form>
  );
};

export default BoardSearchInput;
