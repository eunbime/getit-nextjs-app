"use client";

import { User } from "@prisma/client";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const updateNameSchema = z.object({
  name: z
    .string()
    .min(1, "닉네임을 입력해주세요")
    .max(25, "닉네임은 15자 이내로 입력해주세요"),
});

type UpdateNameFormData = z.infer<typeof updateNameSchema>;

interface UpdateNameProps {
  currentUser: User | null;
}

export default function UpdateName({ currentUser }: UpdateNameProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<UpdateNameFormData>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: currentUser?.name ?? "",
    },
  });

  const { mutate: updateName, isLoading } = useMutation({
    mutationFn: async (data: UpdateNameFormData) => {
      const response = await axios.patch("/api/user/profile", {
        name: data.name, // 명시적으로 name 필드를 지정
      });
      return response.data;
    },
    onSuccess: () => {
      setIsEditing(false);
      window.location.reload();
    },
    onError: (error: any) => {
      console.error("Update error:", error); // 에러 로깅 추가
      setError("name", {
        type: "manual",
        message: "닉네임 업데이트에 실패했습니다.",
      });
    },
  });

  const onSubmit = (data: UpdateNameFormData) => {
    console.log(data.name);
    updateName(data);
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="nickname">닉네임</Label>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          {isEditing ? (
            <Input
              id="nickname"
              {...register("name")}
              className="w-full"
              disabled={isLoading}
            />
          ) : (
            <p>{currentUser?.name}</p>
          )}
          <Button onClick={handleEditToggle} disabled={isLoading}>
            {isLoading ? "처리중..." : "수정"}
          </Button>
        </div>
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
    </div>
  );
}
