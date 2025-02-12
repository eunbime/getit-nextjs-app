import { CATEGORY_TITLE, CategoryType } from "@/constants/categories";
import { TPostWithCategoryWithAuthor } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

interface BoardListItemProps {
  post: TPostWithCategoryWithAuthor;
}

const BoardListItem = ({ post }: BoardListItemProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: updateViewCount } = useMutation({
    mutationFn: async (postId: string) => {
      await axios.patch(`/api/talk/posts/${postId}`, {
        viewCount: post.viewCount + 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talk-posts"] });
    },
  });

  const handleClick = () => {
    updateViewCount(post.id);
    router.push(`/talk/${post.id}`);
  };

  const date = new Date(post.createdAt);
  const formattedDate = date.toLocaleDateString();

  return (
    <li
      onClick={handleClick}
      className="flex items-center gap-2 md:gap-5 justify-between p-4 border-b-2 border-gray-200 cursor-pointer hover:bg-gray-100 text-xs md:text-base"
    >
      <div className="flex gap-8 md:gap-10 flex-1 min-w-0">
        <p className="w-[120px] md:w-[200px] shrink-0">
          {CATEGORY_TITLE[post.category.name as CategoryType]} /{" "}
          {post.subcategory.name}
        </p>
        <p className="flex-1 truncate">{post.title}</p>
      </div>
      <div className="flex gap-2 md:gap-5 shrink-0">
        <p>{post.author.name}</p>
        <p>{formattedDate}</p>
        <p>{post.viewCount}</p>
        <p>{post.recommendCount}</p>
      </div>
    </li>
  );
};

export default BoardListItem;
