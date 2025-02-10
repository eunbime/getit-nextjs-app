import Avatar from "@/components/common/Avatar";
import Container from "@/components/common/Container";
import TalkMenuNav from "@/components/navigation/TalkMenuNav";
import TalkComment from "@/components/talk/TalkComment";
import TalkCommentInput from "@/components/talk/TalkCommentInput";

export default function TalkPostPage({
  params,
}: {
  params: { postId: string };
}) {
  return (
    <Container>
      <div className="flex h-full w-full justify-between gap-10">
        <TalkMenuNav />
        <div className="flex flex-col gap-10 w-full h-full">
          <section className="w-full h-full">
            <h3 className="text-3xl font-bold border-b border-gray-200 pb-4">
              title
            </h3>
            <div className="py-4 border-b border-gray-200 min-h-[300px]">
              content
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <div className="flex gap-2 items-center">
                <Avatar src={""} />
                <p>작성자</p>
              </div>
              <div className="flex gap-2">
                <p>작성일</p>
                <p>조회수</p>
                <p>좋아요</p>
              </div>
            </div>
          </section>
          <TalkComment />
          <TalkCommentInput />
        </div>
      </div>
    </Container>
  );
}
