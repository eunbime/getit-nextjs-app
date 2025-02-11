import { useRouter } from "next/navigation";
import BoardListItem from "./BoardListItem";
import { TPostWithCategoryWithAuthor } from "@/types";

interface BoardListProps {
  post: TPostWithCategoryWithAuthor;
}

const BoardList = ({ post }: BoardListProps) => {
  return (
    <section className="w-full h-full">
      <ul className="w-full h-full flex flex-col">
        <BoardListItem post={post} />
      </ul>
    </section>
  );
};

export default BoardList;
