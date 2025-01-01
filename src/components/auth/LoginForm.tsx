"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/schemas";
import Social from "./social";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams?.get("error") === "OAuthAccountNotLinked"
      ? "이미 다른 계정에서 사용중인 이메일입니다."
      : "";

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (body) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        ...body,
        redirect: false,
      });

      if (result?.error) {
        console.log("Login error:", result.error);
        setError("root", {
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
        return;
      }
      router.push("/");

      router.refresh();
    } catch (error) {
      console.log("[Sign In]", error);
      setError("root", {
        message: "로그인 중 오류가 발생했습니다",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="grid h-[calc(100vh_-_56px)] place-items-center">
      <form
        className="flex flex-col justify-center gap-4 min-w-[350px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl">로그인</h1>
        <Input
          id="email"
          label="Email"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <p className="text-red-500">{errors.email?.message}</p>
        <Input
          id="password"
          label="Password"
          type="password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <p className="text-red-500">{errors.password?.message}</p>

        <Button label="로그인" />
        <p className="text-red-500 w-full text-center">
          {errors.root?.message || urlError}
        </p>
        <Social />
        <div className="text-center">
          <p className="text-gray-400">
            아직 계정이 없으신가요?{" "}
            <Link
              href={"/auth/register"}
              className="text-black hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default LoginForm;
