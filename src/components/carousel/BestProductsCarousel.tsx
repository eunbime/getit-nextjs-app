"use client";

import { Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { TProductWithCategory } from "@/types";
import { usePopularProducts } from "@/hooks/product/usePopularProducts";
import CarouselImageCard from "@/components/carousel/CarouselImageCard";

const BestProductsCarousel = () => {
  const { data } = usePopularProducts();

  return (
    <div className="w-full h-fit">
      <Swiper
        modules={[Pagination, A11y, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        className="h-full"
      >
        {data?.map((product: TProductWithCategory) => (
          <SwiperSlide key={product.id} className="h-full">
            <CarouselImageCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BestProductsCarousel;
