"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp } from "lucide-react";
import { MovieModal } from "@/components/movie-modal";

const API = "https://api.themoviedb.org/3";
const KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// 🔥 Mapper para adaptar TMDB → tu formato
const mapItem = (m: any) => ({
  id: m.id,
  title: m.title || m.name,
  description: m.overview,
  genre: m.media_type === "movie" ? "Película" : "Serie",
  year: m.release_date?.split("-")[0] || m.first_air_date?.split("-")[0] || "—",
  image: m.poster_path
    ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
    : "/placeholder.jpg",
  poster: m.poster_path
    ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
    : "/placeholder.jpg",
  backdrop: m.backdrop_path
    ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
    : "/placeholder.jpg",
});

const suggestions = [
  { id: "1", text: "Películas de acción", type: "genre" },
  { id: "2", text: "Comedias románticas", type: "genre" },
  { id: "3", text: "Series de suspenso", type: "genre" },
  { id: "4", text: "Documentales de naturaleza", type: "genre" },
  { id: "5", text: "Anime populares", type: "genre" },
  { id: "6", text: "Películas clásicas", type: "popular" },
  { id: "7", text: "Estrenos 2025", type: "popular" },
  { id: "8", text: "Series de Netflix", type: "popular" },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔥 REAL SEARCH — TMDB
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    let timeout = setTimeout(async () => {
      setLoading(true);

      const res = await fetch(
        `${API}/search/multi?api_key=${KEY}&language=es-ES&query=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await res.json();

      setResults(
        data.results
          .filter((m: any) => m.media_type === "movie" || m.media_type === "tv")
          .map(mapItem)
      );

      setLoading(false);
    }, 600); // Delay para no saturar la API

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSuggestionClick = (text: string) => {
    setSearchQuery(text);
  };

  const handleResultClick = (item: any) => {
    setSelectedMovie(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Busca películas, series o géneros..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Suggestions */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-4">Sugerencias</h2>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="w-full text-left p-4 rounded-lg bg-card/50 hover:bg-card border border-border hover:border-primary/50 transition-all flex items-center gap-3"
                  >
                    <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2">
              {searchQuery ? (
                <>
                  <h2 className="text-2xl font-bold mb-4">
                    Resultados para "{searchQuery}"
                  </h2>

                  {loading ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Buscando...
                    </div>
                  ) : results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {results.map((item) => (
                        <div
                          key={item.id}
                          className="cursor-pointer group"
                          onClick={() => handleResultClick(item)}
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
                  ) : (
                    <p>No se encontraron resultados.</p>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-center">
                  <div>
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">
                      Busca películas, series o géneros
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Real */}
      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedMovie}
      />
    </div>
  );
}
