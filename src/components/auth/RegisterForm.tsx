"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (body) => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/register", body);

      if (response.status === 404) {
        setError("root", {
          message: "이미 가입된 이메일입니다.",
        });
        return;
      }

      router.push("/auth/login");
    } catch (error) {
      console.log("submit", error);
      setError("root", {
        message: "이미 가입된 이메일입니다.",
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
        <h1 className="text-2xl">회원가입</h1>
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
          id="name"
          label="Name"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <p className="text-red-500">{errors.name?.message}</p>
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
        <Button label="회원가입" />
        <p className="text-red-500 w-full text-center">
          {errors.root?.message}
        </p>
        <div className="text-center">
          <p className="text-gray-400">
            이미 계정이 있으신가요?{" "}
            <Link href={"/auth/login"} className="text-black hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default RegisterForm;
