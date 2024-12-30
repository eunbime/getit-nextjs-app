"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const Social = () => {
  const onClick = (provider: "google" | "github") => {
    try {
      console.log("111");
      signIn(provider, {
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.log("소셜 로그인 중 오류가 발생했습니다.", error);
    }
  };

  return (
    <div className="flex items-center w-full gap-x-2 ">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
        type="button"
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("github")}
        type="button"
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Social;
