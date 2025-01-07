"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { User } from "@prisma/client";
import uploadImage from "@/helpers/uploadImage";
import { Button } from "@/components/ui/button";

interface UserImageProps {
  currentUser: User | null;
}

const UserImage = ({ currentUser }: UserImageProps) => {
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const imageUrl = await uploadImage(file);
      return axios.post(`/api/profile/upload-image`, {
        image: imageUrl,
        userId: currentUser?.id,
      });
    },
    onSuccess: (response) => {
      queryClient.setQueryData(["profile"], (oldData: any) => ({
        ...oldData,
        image: response.data.image,
      }));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      console.error("이미지 업로드 에러:", error);
      setPreviewImage(null);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);

    mutate(file);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-48 h-48 bg-gray-200 rounded-lg overflow-hidden">
        <Image
          src={
            previewImage ||
            currentUser?.image ||
            "/images/profile_placeholder.png"
          }
          alt="Profile"
          width={192}
          height={192}
          className="w-full h-full object-cover"
          priority
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          disabled={isPending}
        />
      </div>
      <Button
        size="sm"
        className="w-20"
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
        variant="primary"
      >
        이미지 변경
      </Button>
    </div>
  );
};

export default UserImage;
