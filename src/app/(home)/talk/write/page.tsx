import TalkWriteForm from "@/components/talk/TalkWriteForm";
import { Suspense } from "react";

export default function TalkWritePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full h-full flex flex-col gap-5 p-10">
        <TalkWriteForm />
      </div>
    </Suspense>
  );
}
