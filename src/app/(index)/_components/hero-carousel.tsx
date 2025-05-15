"use client";

import carousel1 from "@/assets/images/hero/1.webp";
import carousel2 from "@/assets/images/hero/2.webp";
import carousel3 from "@/assets/images/hero/3.webp";
import carousel4 from "@/assets/images/hero/4.webp";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function HeroCarousel() {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent>
        <CarouselItem className="pl-0">
          <Image src={carousel1} alt="" />
        </CarouselItem>
        <CarouselItem className="pl-0">
          <Image src={carousel2} alt="" />
        </CarouselItem>
        <CarouselItem className="pl-0">
          <Image src={carousel3} alt="" />
        </CarouselItem>
        <CarouselItem className="pl-0">
          <Image src={carousel4} alt="" />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
