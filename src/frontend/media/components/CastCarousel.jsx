"use client";

import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export function CastCarousel({ persons }) {
  const list = persons ?? []; // Protección SSR

  return (
    <Swiper
      spaceBetween={5}
      slidesPerView={5}
      navigation={true}
      modules={[Navigation]}
      className="mySwiper"
      watchSlidesProgress={true}
      breakpoints={{
        320: { slidesPerView: 3.5 },
        640: { slidesPerView: 4.5 },
        768: { slidesPerView: 5.5 },
        1024: { slidesPerView: 6.5 },
      }}
    >
      {list.map((person) => (
        <SwiperSlide key={person.id}>
          <div className="rounded-md p-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-gradient-to-l from-sky-900/20 to-voilet-900/20">
            <Link href={`/reactflix/person/${person.id}`}>
              {person.profile_path === null ? (
                <LazyLoadImage
                  className="rounded-md"
                  src="https://picsum.photos/200/300/?blur=2"
                  alt={person.name}
                  effect="blur"
                />
              ) : (
                <LazyLoadImage
                  className="rounded-md"
                  src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
                  alt={person.name}
                  effect="blur"
                />
              )}
            </Link>

            <div className="my-2">
              <h1 className="text-teal-50 text-sm lg:text-xl overflow-hidden text-ellipsis whitespace-nowrap">
                {person.name}
              </h1>
              <h2 className="text-xs overflow-hidden text-ellipsis whitespace-nowrap text-zinc-500">
                {person.character}
              </h2>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
