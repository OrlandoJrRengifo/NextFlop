"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { HeroCarousel } from "@/components/hero-carousel";
import { ContentCarousel } from "@/components/content-carousel";
import { ContinueWatching } from "@/components/continue-watching";
import { MovieModal } from "@/components/movie-modal";

import { getPopularMovies, getPopularSeries, getTrending } from "@/services/tmdb";
import { mapTMDB } from "@/services/tmdb-mapper";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [trending, setTrendingItems] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔥 Fetch directo desde TMDB (sí, con API KEY expuesta)
  useEffect(() => {
    async function load() {
      const m = await getPopularMovies();
      const s = await getPopularSeries();
      const t = await getTrending();

      setMovies(m.map(mapTMDB));
      setSeries(s.map(mapTMDB));
      setTrendingItems(t.map(mapTMDB));
    }

    load();
  }, []);

  const handleItemClick = (item: any) => {
    setSelectedMovie(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-16">
        <div className="space-y-8 pb-12">
          
          {/* Hero con películas reales */}
          <HeroCarousel items={movies} onItemClick={handleItemClick} />

          <div className="container mx-auto px-4 space-y-8">

            <ContinueWatching items={movies.slice(0, 3)} />

            <ContentCarousel
              title="En tendencia"
              items={trending}
              onItemClick={handleItemClick}
            />

            <ContentCarousel
              title="Películas populares"
              items={movies}
              onItemClick={handleItemClick}
            />

            <ContentCarousel
              title="Series populares"
              items={series}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </main>

      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedMovie}
      />
    </div>
  );
}
