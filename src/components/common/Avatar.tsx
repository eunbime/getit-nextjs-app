"use client";

import Image from "next/image";

interface AvatarProps {
  src: string | null | undefined;
}

const Avatar = ({ src }: AvatarProps) => {
  return (
    <Image
      src={src || "https://via.placeholder.com/400x400?text=no+user+image"}
      width={30}
      height={30}
      alt="Avatar"
      className="w-10 h-10 rounded-full"
      loading="lazy"
      quality={80}
    />
  );
};

export default Avatar;
