import Container from "@/components/common/Container";
import TalkMenuNav from "@/components/navigation/TalkMenuNav";
import TalkPostContent from "@/components/talk/\bTalkPostContent";
import TalkComment from "@/components/talk/TalkComment";
import TalkCommentInput from "@/components/talk/TalkCommentInput";

export default function TalkPostPage({
  params,
}: {
  params: { postId: string };
}) {
  const { postId } = params;

  return (
    <Container>
      <div className="flex h-full w-full justify-between gap-10">
        <TalkMenuNav />
        <div className="flex flex-col gap-10 w-full h-full">
          <TalkPostContent postId={postId} />
          <TalkComment />
          <TalkCommentInput />
        </div>
      </div>
    </Container>
  );
}
