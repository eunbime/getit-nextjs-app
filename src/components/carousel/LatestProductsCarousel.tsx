"use client";

import { Navigation, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TProductWithCategory } from "@/types";
import CarouselProductCard from "./CarouselProductCard";
import NavigationButton from "../common/NavigationButton";
import { Swiper, SwiperSlide } from "swiper/react";

const LatestProductsCarousel = () => {
  const { data } = useQuery({
    queryKey: ["latest-products"],
    queryFn: async () => {
      const response = await axios.get("/api/posts/latest", {
        params: {
          limit: 10,
          page: 1,
        },
      });
      return response.data;
    },
  });

  return (
    <div className="relative h-fit">
      <Swiper
        modules={[Navigation, A11y]}
        spaceBetween={50}
        slidesPerView={3}
        breakpoints={{
          768: {
            slidesPerView: 4,
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
