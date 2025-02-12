import TalkComment from "@/components/talk/TalkComment";
import TalkCommentInput from "@/components/talk/TalkCommentInput";
import { TCommentWithUserWithReplies } from "@/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import axios from "axios";

interface TalkCommentComponentProps {
  postId: string;
}

export default async function TalkCommentComponent({
  postId,
}: TalkCommentComponentProps) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery<TCommentWithUserWithReplies[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/talk/posts/${postId}/comments`
      );
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TalkComment postId={postId} />
      <TalkCommentInput postId={postId} />
    </HydrationBoundary>
  );
}
