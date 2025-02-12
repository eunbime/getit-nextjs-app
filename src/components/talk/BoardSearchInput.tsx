import { useState } from "react";
import { IoSearch } from "react-icons/io5";

interface BoardSearchInputProps {
  setKeyword: (keyword: string) => void;
}

const BoardSearchInput = ({ setKeyword }: BoardSearchInputProps) => {
  const [value, setValue] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setKeyword(value);
    setValue("");
  };

  return (
    <form className="flex items-center gap-2 " onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="검색"
        className="outline-none border-none py-1 px-2 text-black"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">
        <IoSearch />
      </button>
    </form>
  );
};

export default BoardSearchInput;
