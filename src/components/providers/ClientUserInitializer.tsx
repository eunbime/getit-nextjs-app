"use client";

import { useUserStore } from "@/store/userStore";
import { User } from "@prisma/client";
import { useEffect } from "react";

export default function ClientUserInitializer({
  currentUser,
}: {
  currentUser: User | null;
}) {
  const { setCurrentUser } = useUserStore();

  useEffect(() => {
    setCurrentUser(currentUser);
  }, [currentUser, setCurrentUser]);

  return null;
}
