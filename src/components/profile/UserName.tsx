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

interface UserNameProps {
  currentUser: User | null;
}

export default function UserName({ currentUser }: UserNameProps) {
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

  const { mutate: updateName } = useMutation({
    mutationFn: async (data: UpdateNameFormData) => {
      console.log(data.name);
      const response = await axios.patch("/api/profile", {
        name: data.name,
      });
      console.log(response.data);
      return response.data;
    },
    onSuccess: () => {
      setIsEditing(false);
      window.location.reload();
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      setError("name", {
        type: "manual",
        message: "닉네임 업데이트에 실패했습니다.",
      });
    },
  });

  const onSubmit = (data: UpdateNameFormData) => {
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
            <Input id="nickname" {...register("name")} className="w-full" />
          ) : (
            <p>{currentUser?.name}</p>
          )}
          <Button onClick={handleEditToggle}>수정</Button>
        </div>
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
    </div>
  );
}
