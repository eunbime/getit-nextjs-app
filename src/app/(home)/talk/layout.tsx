import WriteFloatingButton from "@/components/talk/WriteFloatingButton";

export default function TalkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full pt-14">
      {children}
      <WriteFloatingButton />
    </div>
  );
}
