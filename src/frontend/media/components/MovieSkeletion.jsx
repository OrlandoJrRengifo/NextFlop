"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Skeleton } from "./ui/skeleton";

export function MovieSkeleton() {
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={5}
      breakpoints={{
        320: { slidesPerView: 3 },
        640: { slidesPerView: 4 },
        768: { slidesPerView: 5 },
        1024: { slidesPerView: 6 },
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <SwiperSlide key={i}>
          <Skeleton
            className="rounded-md p-2 w-full"
            style={{ aspectRatio: "9/16" }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
