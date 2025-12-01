"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { MovieModal } from "@/components/movie-modal";
import { useParams } from "next/navigation";

const API = "https://api.themoviedb.org/3";
const KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// 🎯 MAPA COMPLETO DE TUS SLUGS → IDS DE TMDB
const GENRE_MAP: Record<string, number> = {
  action: 28,
  comedy: 35,
  romance: 10749,
  terror: 27,
  thriller: 53,
  suspense: 53,
  anime: 16,
  documentary: 99,
  family: 10751,
  drama: 18,
  "sci-fi": 878,
  fantasy: 14,
  adventure: 12,
  musical: 10402,
  western: 37,
};

// 🔥 MAPEADOR → adapta TMDB a tu frontend
const mapItem = (m: any) => ({
  id: m.id,
  title: m.title || m.name,
  image: m.poster_path
    ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
    : "/placeholder.jpg",
  poster: m.poster_path
    ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
    : "/placeholder.jpg",
  backdrop: m.backdrop_path
    ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
    : "/placeholder.jpg",
  media_type: "movie",
  overview: m.overview,
});

export default function GenrePage() {
  const params = useParams();
  const genreSlug = params.genre as string;

  const [items, setItems] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const genreId = GENRE_MAP[genreSlug];
  const genreName = genreSlug.charAt(0).toUpperCase() + genreSlug.slice(1);

  // 🚀 Cargar películas reales del género
  useEffect(() => {
    if (!genreId) return;

    async function load() {
      const res = await fetch(
        `${API}/discover/movie?api_key=${KEY}&language=es-ES&with_genres=${genreId}`
      );
      const data = await res.json();
      setItems(data.results.map(mapItem));
    }

    load();
  }, [genreId]);

  const handleClick = (item: any) => {
    setSelectedMovie(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{genreName}</h1>
            <p className="text-lg text-muted-foreground">
              Explora contenido real de {genreName.toLowerCase()}
            </p>
          </div>

          {/* 🎞️ GRID DE PELÍCULAS */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer group"
                onClick={() => handleClick(item)}
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 transition-transform group-hover:scale-105">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 📌 MODAL REAL */}
      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedMovie}
      />
    </div>
  );
}
