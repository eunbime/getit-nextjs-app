import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

import { prefetchTalkPosts } from "@/hooks/talk/usePosts";
import Container from "@/components/common/Container";
import TalkMenuNav from "@/components/navigation/TalkMenuNav";
import TalkBoard from "@/components/talk/TalkBoard";

export const metadata: Metadata = {
  title: "TALKIT 토크",
  description: "TALKIT 커뮤니티입니다.",
};

export default async function TalkPage() {
  const queryClient = new QueryClient();

  await prefetchTalkPosts(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container>
        <div className="flex h-full w-full justify-between gap-10">
          <TalkMenuNav />
          <TalkBoard />
        </div>
      </Container>
    </HydrationBoundary>
  );
}
