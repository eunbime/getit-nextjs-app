import Container from "@/components/common/Container";
import TalkMenuNav from "@/components/navigation/TalkMenuNav";
import TalkPostContent from "@/components/talk/\bTalkPostContent";
import TalkComment from "@/components/talk/TalkComment";
import TalkCommentInput from "@/components/talk/TalkCommentInput";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import axios from "axios";

export default async function TalkPostPage({
  params,
}: {
  params: { postId: string };
}) {
  const { postId } = params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/talk/posts/${postId}`
      );
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container>
        <div className="flex h-full w-full justify-between gap-10">
          <TalkMenuNav />
          <div className="flex flex-col gap-10 w-full h-full">
            <TalkPostContent postId={postId} />
            <TalkComment postId={postId} />
            <TalkCommentInput postId={postId} />
          </div>
        </div>
      </Container>
    </HydrationBoundary>
  );
}
