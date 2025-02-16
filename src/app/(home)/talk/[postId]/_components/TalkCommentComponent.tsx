import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { prefetchTalkComments } from "@/hooks/talk/useComments";
import TalkComment from "@/components/talk/TalkComment";
import TalkCommentInput from "@/components/talk/TalkCommentInput";

interface TalkCommentComponentProps {
  postId: string;
}

export default async function TalkCommentComponent({
  postId,
}: TalkCommentComponentProps) {
  const queryClient = new QueryClient();
  await prefetchTalkComments(queryClient, postId);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TalkComment postId={postId} />
      <TalkCommentInput postId={postId} />
    </HydrationBoundary>
  );
}
