import Image from "next/image";

import Heading from "@/components/common/Heading";
import HeartButton from "@/components/common/HeartButton";

interface ProductHeadProps {
  title?: string;
  imageSrc?: string;
  id?: string;
}

const ProductHead = ({ title, id, imageSrc }: ProductHeadProps) => {
  return (
    <div className="w-full">
      <Heading title={title} />
      <div className="relative w-full aspect-square mx-auto overflow-hidden rounded-xl mt-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${imageSrc?.replace(
              "/upload/",
              "/upload/w_300,h_300,c_fill,e_blur:200,f_jpg,q_1/"
            )})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(10px)",
          }}
        />
        <Image
          src={imageSrc || ""}
          fill
          className="object-cover"
          alt="Image"
          priority
        />
        <div className="absolute top-5 right-5">
          <HeartButton productId={id} />
        </div>
      </div>
    </div>
  );
};

export default ProductHead;
