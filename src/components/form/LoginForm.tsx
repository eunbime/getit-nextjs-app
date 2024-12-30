"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginSchema } from "@/schemas";

const LoginForm = () => {
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

  useEffect(() => {
    // 페이지가 클라이언트에서만 렌더링되도록 로그 추가 (디버깅용)
    console.log("LoginPage rendered on client side");
  }, []);

  return (
    <section className="grid h-[calc(100vh_-_56px)] place-items-center">
      <form
        className="flex flex-col justify-center gap-4 min-w-[350px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl">Login</h1>
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

        <Button label="Login" />
        <p className="text-red-500 w-full text-center">
          {errors.root?.message}
        </p>
        <div className="text-center">
          <p className="text-gray-400">
            Not a member?{" "}
            <Link
              href={"/auth/register"}
              className="text-black hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default LoginForm;
