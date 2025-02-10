import Container from "@/components/common/Container";
import TalkMenuNav from "@/components/navigation/TalkMenuNav";
import TalkBoard from "@/components/talk/TalkBoard";

export default function TalkPage() {
  return (
    <Container>
      <div className="flex h-full w-full justify-between gap-10">
        <TalkMenuNav />
        <TalkBoard />
      </div>
    </Container>
  );
}
