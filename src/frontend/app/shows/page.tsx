"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { ContentCarousel } from "@/components/content-carousel";
import { MovieModal } from "@/components/movie-modal";

const API = "https://api.themoviedb.org/3";
const KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const mapShow = (s: any) => ({
  id: s.id,
  title: s.name,
  image: s.poster_path
    ? `https://image.tmdb.org/t/p/w500${s.poster_path}`
    : "/placeholder.jpg",
  poster: s.poster_path
    ? `https://image.tmdb.org/t/p/w500${s.poster_path}`
    : "/placeholder.jpg",
  backdrop: s.backdrop_path
    ? `https://image.tmdb.org/t/p/original${s.backdrop_path}`
    : "/placeholder.jpg",
  media_type: "tv",
});

export default function ShowsPage() {
  const [selectedShow, setSelectedShow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [recommended, setRecommended] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [newShows, setNewShows] = useState<any[]>([]);
  const [miniSeries, setMiniSeries] = useState<any[]>([]);
  const [top10, setTop10] = useState<any[]>([]);

  const handleItemClick = (item: any) => {
    setSelectedShow(item);
    setIsModalOpen(true);
  };

  useEffect(() => {
    async function load() {
      const endpoints = {
        recommended: `${API}/trending/tv/week?api_key=${KEY}&language=es-ES`,
        popular: `${API}/tv/popular?api_key=${KEY}&language=es-ES`,
        newShows: `${API}/tv/on_the_air?api_key=${KEY}&language=es-ES`,
        miniSeries: `${API}/discover/tv?api_key=${KEY}&with_runtime.lte=240&language=es-ES`,
        top10: `${API}/trending/tv/week?api_key=${KEY}&language=es-ES`,
      };

      const fetchAndSet = async (url: string, setter: any) => {
        const res = await fetch(url);
        const data = await res.json();
        setter(data.results.map(mapShow));
      };

      await Promise.all([
        fetchAndSet(endpoints.recommended, setRecommended),
        fetchAndSet(endpoints.popular, setPopular),
        fetchAndSet(endpoints.newShows, setNewShows),
        fetchAndSet(endpoints.miniSeries, setMiniSeries),
        fetchAndSet(endpoints.top10, setTop10),
      ]);
    }

    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 space-y-8">

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Series</h1>
            <p className="text-lg text-muted-foreground">Encuentra tu próxima serie favorita</p>
          </div>

          <ContentCarousel
            title="Series recomendadas"
            items={recommended}
            onItemClick={(item) => handleItemClick(item)}
          />

          <ContentCarousel
            title="Series populares"
            items={popular}
            onItemClick={(item) => handleItemClick(item)}
          />

          <ContentCarousel
            title="Series nuevas"
            items={newShows}
            onItemClick={(item) => handleItemClick(item)}
          />

          <ContentCarousel
            title="Miniseries"
            items={miniSeries}
            onItemClick={(item) => handleItemClick(item)}
          />

          <ContentCarousel
            title="Top 10 de la semana"
            items={top10}
            onItemClick={(item) => handleItemClick(item)}
          />

        </div>
      </main>

      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedShow}
      />
    </div>
  );
}
