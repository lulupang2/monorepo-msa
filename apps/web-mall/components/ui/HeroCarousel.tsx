"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@mall/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import api from "../../lib/api";

interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  sort_order: number;
}

const GRADIENTS = [
  "from-purple-600/30 to-blue-600/30",
  "from-amber-600/30 to-stone-900/30",
  "from-cyan-600/30 to-magenta-600/30",
  "from-emerald-600/30 to-teal-900/30"
];

export function HeroCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await api.get("/api/order/api/banners?activeOnly=true");
        setBanners(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch banners", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (isLoading || banners.length === 0) {
    return (
      <div className="w-full h-[400px] md:h-[500px] bg-slate-900 flex items-center justify-center">
        <div className="text-white opacity-20 animate-pulse font-black text-4xl">MALL LOADING...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner, idx) => (
            <div
              key={banner.id}
              className="relative flex-[0_0_100%] min-w-0 h-[400px] md:h-[500px]"
            >
              <img
                src={banner.image_url || "/images/no-image.png"}
                alt={banner.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/no-image.png";
                }}
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${GRADIENTS[idx % GRADIENTS.length]} to-slate-900/40`} />
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 max-w-4xl">
                <div className="overflow-hidden">
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
                    {banner.title}
                  </h2>
                </div>
                <p className="text-xl text-slate-100 mb-10 drop-shadow-lg max-w-xl animate-in slide-in-from-bottom-2 duration-700 delay-100">
                  {banner.description}
                </p>
                <div className="flex gap-4 animate-in fade-in duration-1000 delay-300">
                  <Button 
                    size="lg" 
                    className="bg-white text-slate-900 hover:bg-slate-200 rounded-2xl px-10 h-14 font-black shadow-xl"
                    onClick={() => window.location.href = banner.link_url || "#"}
                  >
                    지금 확인하기
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/40 hover:bg-white/10 rounded-2xl px-10 h-14 font-bold backdrop-blur-sm"
                  >
                    내용 더보기
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md border border-white/10 z-20"
        onClick={scrollPrev}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md border border-white/10 z-20"
        onClick={scrollNext}
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {banners.map((_, index) => (
          <div
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === 0 ? 'bg-white w-8' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
