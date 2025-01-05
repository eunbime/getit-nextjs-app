import { Receiver } from "@/app/chat/ChatClient";
import { useEffect, useState } from "react";

interface UseLayoutProps {
  setReceiver: (receiver: Receiver) => void;
  searchParams: URLSearchParams | null;
}

export const useLayout = ({ setReceiver, searchParams }: UseLayoutProps) => {
  const [layout, setLayout] = useState(false);

  useEffect(() => {
    const id = searchParams?.get("id");
    const name = searchParams?.get("name");
    const open = searchParams?.get("open");
    const image = searchParams?.get("image");

    // 파라미터가 있으면 채팅창 열기
    if (id && name) {
      setReceiver({
        receiverId: id,
        receiverName: name,
        receiverImage: image || "",
      });

      if (open === "true") {
        setLayout(true);
      }
    }
  }, [searchParams]);

  return { layout, setLayout };
};
