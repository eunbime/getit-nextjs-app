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
    <form className="flex items-center gap-3 w-full" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="검색"
        className="w-full outline-none border-none py-1 px-2 text-black rounded-md"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">
        <IoSearch size={25} />
      </button>
    </form>
  );
};

export default BoardSearchInput;
