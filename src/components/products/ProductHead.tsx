import Image from "next/image";

import { User } from "@prisma/client";
import Heading from "@/components/common/Heading";
import HeartButton from "@/components/common/HeartButton";

interface ProductHeadProps {
  title: string;
  imageSrc: string;
  id: string;
  currentUser?: User | null;
}

const ProductHead = ({
  title,
  id,
  imageSrc,
  currentUser,
}: ProductHeadProps) => {
  return (
    <>
      <Heading title={title} />
      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <Image
          src={imageSrc}
          fill
          className="object-cover w-full"
          alt="Image"
        />
        <div className="absolute top-5 right-5">
          <HeartButton productId={id} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
};

export default ProductHead;
