"use client";

import { Pagination, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TProductWithCategory } from "@/types";
import CarouselImageCard from "./CarouselImageCard";

const BestProductsCarousel = () => {
  const { data } = useQuery<TProductWithCategory[]>({
    queryKey: ["popular-products"],
    queryFn: async () => {
      const response = await axios.get("/api/posts/popular");
      return response.data;
    },
  });

  return (
    <div className="w-full h-fit">
      <Swiper
        modules={[Pagination, A11y, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
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
