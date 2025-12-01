"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Clock, Heart, Play } from "lucide-react";
import { ActionPopup } from "@/components/action-popup";

import {
  addFavorite,
  removeFavorite,
  isFavorite as checkIsFavorite,
} from "@/services/favorites";

import {
  addWatchLater,
  removeWatchLater,
  isInWatchLater as checkIsInWatchLater,
} from "@/services/watchlater";

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie?: any;
}

export function MovieModal({ isOpen, onClose, movie }: MovieModalProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIcon, setPopupIcon] = useState<"heart" | "clock">("heart");
  const [isFav, setIsFav] = useState(false);
  const [inWatchLater, setInWatchLater] = useState(false);

  const [fullDetails, setFullDetails] = useState<any>(null);

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const BASE = "https://api.themoviedb.org/3";

  // 🔥 Cargar detalles completos al abrir el modal
  useEffect(() => {
    if (!isOpen || !movie) return;

    async function fetchFull() {
      const type = movie.media_type === "tv" ? "tv" : "movie";

      const res = await fetch(
        `${BASE}/${type}/${movie.id}?api_key=${API_KEY}&language=es-ES`
      );
      const data = await res.json();
      setFullDetails(data);
    }

    fetchFull();
  }, [isOpen, movie]);

  // 🔥 Sincronizar estados (favorito / watch later) al abrir
  useEffect(() => {
    if (!movie || typeof window === "undefined") return;
    setIsFav(checkIsFavorite(movie.id));
    setInWatchLater(checkIsInWatchLater(movie.id));
  }, [isOpen, movie]);

  if (!movie) return null;

  // URL de imagen completa
  const imageUrl =
    movie.image ||
    movie.poster ||
    movie.backdrop ||
    (movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
      : "/placeholder.jpg");

  const poster = imageUrl;

  const description =
    fullDetails?.overview ||
    movie.description ||
    movie.overview ||
    "Sin descripción disponible";

  const genres =
    fullDetails?.genres?.map((g: any) => g.name).join(", ") ||
    "Género no disponible";

  const year =
    fullDetails?.release_date?.slice(0, 4) ||
    fullDetails?.first_air_date?.slice(0, 4) ||
    movie.year;

  const rating = fullDetails?.vote_average?.toFixed(1);

  const duration =
    fullDetails?.runtime || fullDetails?.episode_run_time?.[0] || null;

  const handleAddToWatchLater = () => {
    if (!movie) return;

    addWatchLater({
      id: movie.id,
      title: movie.title || movie.name,
      image: imageUrl,
    });

    setInWatchLater(true);
    setPopupMessage(`"${movie.title}" agregado a Ver más tarde`);
    setPopupIcon("clock");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleToggleFavorite = () => {
    if (!movie) return;

    const newState = !isFav;
    setIsFav(newState);

    if (newState) {
      addFavorite({
        id: movie.id,
        title: movie.title || movie.name,
        image: imageUrl,
      });
    } else {
      removeFavorite(movie.id);
    }

    setPopupMessage(
      newState
        ? `"${movie.title}" agregado a Favoritos`
        : `"${movie.title}" eliminado de Favoritos"`
    );

    setPopupIcon("heart");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {/* Imagen */}
          <div className="relative aspect-video">
            <img
              src={poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>

          {/* Contenido */}
          <div className="p-6">
            <DialogTitle className="text-3xl font-bold mb-2">
              {movie.title}
            </DialogTitle>

            {/* INFO COMPLETA */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              {year && <span>{year}</span>}

              {rating && (
                <>
                  <span>•</span>
                  <span>⭐ {rating}/10</span>
                </>
              )}

              {duration && (
                <>
                  <span>•</span>
                  <span>{duration} min</span>
                </>
              )}

              {genres && (
                <>
                  <span>•</span>
                  <span>{genres}</span>
                </>
              )}
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {description}
            </p>

            <div className="flex gap-3">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Play className="h-5 w-5 mr-2 fill-primary-foreground" />
                Reproducir
              </Button>

              <Button
                size="lg"
                variant={inWatchLater ? "default" : "outline"}
                onClick={handleAddToWatchLater}
              >
                <Clock className="h-5 w-5 mr-2" />
                {inWatchLater ? "En Ver más tarde" : "Ver más tarde"}
              </Button>

              <Button
                size="lg"
                variant={isFav ? "default" : "outline"}
                onClick={handleToggleFavorite}
                className={isFav ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <Heart
                  className={`h-5 w-5 ${isFav ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
