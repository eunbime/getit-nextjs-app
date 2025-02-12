import Container from "@/components/common/Container";
import TalkMenuNav from "@/components/navigation/TalkMenuNav";
import TalkBoard from "@/components/talk/TalkBoard";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import axios from "axios";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function TalkPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const queryClient = new QueryClient();
  console.log(searchParams);

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["talk-posts", searchParams.category, searchParams.subcategory],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/talk/posts`,
        {
          params: {
            page: pageParam,
            limit: 20,
            sort: "createdAt",
            order: "desc",
            category: searchParams.category,
            subcategory: searchParams.subcategory,
          },
        }
      );
      return data;
    },
    getNextPageParam: (lastPage: any) => {
      if (!lastPage.hasNextPage) return undefined;
      return lastPage.currentPage + 1;
    },
    initialPageParam: 1,
  });

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
