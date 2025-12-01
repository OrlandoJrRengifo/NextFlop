"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Clock,
  Play,
  Info,
} from "lucide-react";
import { ActionPopup } from "@/components/action-popup";

import { addFavorite, isFavorite } from "@/services/favorites";
import { addWatchLater, isInWatchLater } from "@/services/watchlater";

interface CarouselItem {
  id: string;
  title: string;
  image?: string;
  poster?: string;
  backdrop?: string;
}

interface ContentCarouselProps {
  title: string;
  items: CarouselItem[];
  onItemClick?: (item: any) => void;
}

export function ContentCarousel({
  title,
  items,
  onItemClick,
}: ContentCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIcon, setPopupIcon] = useState<"heart" | "clock">("heart");

  const scroll = (direction: "left" | "right") => {
    const id = `carousel-${title.replace(/\s+/g, "-")}`;
    const container = document.getElementById(id);

    if (container) {
      const scrollAmount = 400;
      const newPosition =
        direction === "left"
          ? scrollPosition - scrollAmount
          : scrollPosition + scrollAmount;

      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };

  // ⭐ ESTA es la parte importante: LECTURA DIRECTA de localStorage
  const checkFav = (id: string) => isFavorite(id);
  const checkWatch = (id: string) => isInWatchLater(id);

  const handleAddToFavorites = (
    e: React.MouseEvent,
    item: CarouselItem
  ) => {
    e.stopPropagation();

    const imageUrl =
      item.image || item.poster || item.backdrop || "/placeholder.jpg";

    addFavorite({
      id: item.id,
      title: item.title,
      image: imageUrl,
    });

    setPopupMessage(`"${item.title}" agregado a Favoritos`);
    setPopupIcon("heart");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleAddToWatchLater = (
    e: React.MouseEvent,
    item: CarouselItem
  ) => {
    e.stopPropagation();

    const imageUrl =
      item.image || item.poster || item.backdrop || "/placeholder.jpg";

    addWatchLater({
      id: item.id,
      title: item.title,
      image: imageUrl,
    });

    setPopupMessage(`"${item.title}" agregado a Ver más tarde`);
    setPopupIcon("clock");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("left")}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("right")}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          id={`carousel-${title.replace(/\s+/g, "-")}`}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => {
            const poster =
              item.image || item.poster || item.backdrop || "/placeholder.jpg";

            const isFav = checkFav(item.id);
            const isWL = checkWatch(item.id);

            return (
              <div
                key={item.id}
                className="flex-shrink-0 w-48 cursor-pointer group"
                onClick={() => onItemClick?.(item)}
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                  <img
                    src={poster}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          className="h-9 w-9 rounded-full bg-white text-black hover:bg-white/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            onItemClick?.(item);
                          }}
                        >
                          <Play className="h-4 w-4 fill-current" />
                        </Button>

                        {/* ❤️ FAVORITO */}
                        <Button
                          size="icon"
                          variant={isFav ? "default" : "outline"}
                          className={`h-9 w-9 rounded-full ${
                            isFav
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-transparent border-white hover:bg-white/20"
                          }`}
                          onClick={(e) => handleAddToFavorites(e, item)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isFav ? "fill-current" : ""
                            }`}
                          />
                        </Button>

                        {/* ⏰ WATCH LATER */}
                        <Button
                          size="icon"
                          variant={isWL ? "default" : "outline"}
                          className={`h-9 w-9 rounded-full ${
                            isWL
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "bg-transparent border-white hover:bg-white/20"
                          }`}
                          onClick={(e) => handleAddToWatchLater(e, item)}
                        >
                          <Clock
                            className={`h-4 w-4 ${
                              isWL ? "fill-current" : ""
                            }`}
                          />
                        </Button>

                        <Button
                          size="icon"
                          variant="outline"
                          className="h-9 w-9 rounded-full bg-transparent border-white hover:bg-white/20 ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            onItemClick?.(item);
                          }}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <ActionPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        message={popupMessage}
        type="success"
        icon={popupIcon}
      />
    </>
  );
}
