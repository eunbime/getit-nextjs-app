import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { prefetchTalkPost } from "@/hooks/talk/usePost";
import TalkCommentComponent from "./_components/TalkCommentComponent";
import Container from "@/components/common/Container";
import TalkMenuNav from "@/components/navigation/TalkMenuNav";
import TalkPostContent from "@/components/talk/TalkPostContent";

export default async function TalkPostPage({
  params,
}: {
  params: { postId: string };
}) {
  const { postId } = params;
  const queryClient = new QueryClient();

  await prefetchTalkPost(queryClient, postId);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container>
        <div className="flex h-full w-full justify-between gap-10">
          <TalkMenuNav />
          <div className="flex flex-col gap-10 w-full h-full">
            <TalkPostContent postId={postId} />
            <TalkCommentComponent postId={postId} />
          </div>
        </div>
      </Container>
    </HydrationBoundary>
  );
}
