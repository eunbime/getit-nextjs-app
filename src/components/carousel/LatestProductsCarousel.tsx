"use client";

import { Navigation, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { TProductWithCategory } from "@/types";
import CarouselProductCard from "@/components/carousel/CarouselProductCard";
import NavigationButton from "@/components/common/NavigationButton";
import { useLatestProducts } from "@/hooks/product/useLatestProducts";
import { useEffect, useState } from "react";

const LatestProductsCarousel = () => {
  const [isClient, setIsClient] = useState(false);
  const { data } = useLatestProducts();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="relative h-fit">
      <Swiper
        modules={[Navigation, A11y]}
        spaceBetween={20}
        slidesPerView={3}
        breakpoints={{
          768: {
            slidesPerView: 4,
            spaceBetween: 50,
          },
        }}
        className="relative"
      >
        <NavigationButton direction="prev" />
        <NavigationButton direction="next" />
        {data?.map((product: TProductWithCategory) => (
          <SwiperSlide key={product.id}>
            <CarouselProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LatestProductsCarousel;
