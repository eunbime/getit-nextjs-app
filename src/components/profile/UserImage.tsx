"use client";

import Image from "next/image";
import { User } from "@prisma/client";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import uploadImage from "@/helpers/uploadImage";
import axios from "axios";

interface UserImageProps {
  currentUser: User | null;
}

const UserImage = ({ currentUser }: UserImageProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      console.log("파일 선택됨:", file); // 디버깅 1

      const imageUrl = await uploadImage(file);
      console.log("이미지 URL 생성됨:", imageUrl); // 디버깅 2
      setIsUploading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/profile/upload-image`,
        {
          image: imageUrl,
          userId: currentUser?.id,
        }
      );

      console.log("API 응답:", response.data); // 디버깅 4
    } catch (error) {
      console.error("이미지 업로드 에러:", error);
      // 에러 처리 로직 추가 필요
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-48 h-48 bg-gray-200 rounded-lg overflow-hidden">
        <Image
          src={currentUser?.image || "/placeholder.svg"}
          alt="Profile"
          width={192}
          height={192}
          className="w-full h-full object-cover"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
      <Button
        size="sm"
        className="w-20"
        onClick={() => fileInputRef.current?.click()}
      >
        이미지 변경
      </Button>
    </div>
  );
};

export default UserImage;
