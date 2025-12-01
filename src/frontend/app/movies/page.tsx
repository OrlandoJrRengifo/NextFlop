'use client';

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { ContentCarousel } from '@/components/content-carousel';
import { MovieModal } from '@/components/movie-modal';

const API = "https://api.themoviedb.org/3";
const KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const mapMovie = (m: any) => ({
  id: m.id,
  title: m.title,
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
});

export default function MoviesPage() {
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [recommended, setRecommended] = useState<any[]>([]);
  const [acclaimed, setAcclaimed] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [classic, setClassic] = useState<any[]>([]);

  const handleItemClick = (item: any) => {
    setSelectedMovie(item);
    setIsModalOpen(true);
  };


  // 🔥 Obtener todas las secciones de TMDB
  useEffect(() => {
    async function load() {
      const endpoints = {
        recommended: `${API}/trending/movie/week?api_key=${KEY}&language=es-ES`,
        acclaimed: `${API}/movie/top_rated?api_key=${KEY}&language=es-ES`,
        recent: `${API}/movie/now_playing?api_key=${KEY}&language=es-ES`,
        popular: `${API}/movie/popular?api_key=${KEY}&language=es-ES`,
        classic: `${API}/discover/movie?api_key=${KEY}&sort_by=release_date.asc&primary_release_year=1990&language=es-ES`,
      };

      const fetchAndSet = async (url: string, setter: any) => {
        const res = await fetch(url);
        const data = await res.json();
        setter(data.results.map(mapMovie));
      };

      await Promise.all([
        fetchAndSet(endpoints.recommended, setRecommended),
        fetchAndSet(endpoints.acclaimed, setAcclaimed),
        fetchAndSet(endpoints.recent, setRecent),
        fetchAndSet(endpoints.popular, setPopular),
        fetchAndSet(endpoints.classic, setClassic),
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
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Películas</h1>
            <p className="text-lg text-muted-foreground">
              Descubre tu próxima película favorita
            </p>
          </div>

          {/* Movie Sections */}
          <ContentCarousel
            title="Recomendado en películas"
            items={recommended}
            onItemClick={(item) => handleItemClick(item)}
          />

          <ContentCarousel
            title="Películas aclamadas"
            items={acclaimed}
            onItemClick={(item) => handleItemClick(item)}
          />

          <ContentCarousel
            title="Películas recientes"
            items={recent}
            onItemClick={(item) => handleItemClick(item)}
          />

          <ContentCarousel
            title="Películas populares"
            items={popular}
            onItemClick={(item) => handleItemClick(item)}

          />

          <ContentCarousel
            title="Clásicos imperdibles"
            items={classic}
            onItemClick={(item) => handleItemClick(item)}
          />
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
