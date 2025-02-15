"use client";

import { useUserStore } from "@/store/userStore";
import { User } from "@prisma/client";
import { useEffect } from "react";

export default function ClientUserInitializer({
  currentUser,
}: {
  currentUser: User | null;
}) {
  // const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  // zustand 최적화 
  // currentUser 변경 시에도 ClientUserInitializer 컴포넌트가 재렌더링
  const { setCurrentUser } = useUserStore();

  useEffect(() => {
    setCurrentUser(currentUser);
  }, [currentUser, setCurrentUser]);

  return null;
}
