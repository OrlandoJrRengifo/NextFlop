"use client";

import React, { useEffect, useState } from "react";
import Card from "./Card";
import MovieCategoryName from "./MovieCategoryName";
import Loader from "./Loader";
import { toast } from "sonner";

export default function Playlist() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    const fetchMovies = async () => {
      const playlist = JSON.parse(localStorage.getItem("playlist")) || [];

      // If playlist empty, skip fetching
      if (playlist.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        const requests = playlist.map(async (id) => {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
          );

          if (!res.ok) return null;

          return res.json();
        });

        const movieData = await Promise.all(requests);

        // Remove failed fetches (nulls)
        const validMovies = movieData.filter(Boolean);

        setMovies(validMovies);
      } catch (err) {
        console.error(err);
        toast.error("Error loading your watchlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [apiKey]);

  const removeFromWatchlist = (id) => {
    const stored = JSON.parse(localStorage.getItem("playlist")) || [];
    const updated = stored.filter((movieId) => movieId !== id);

    localStorage.setItem("playlist", JSON.stringify(updated));

    setMovies((prev) => prev.filter((movie) => movie.id !== id));

    toast.success("Removed from watchlist");
  };

  if (loading) return <Loader color="gray" loading size={20} />;

  return (
    <div className="p-5">
      {movies.length > 0 ? (
        <>
          <MovieCategoryName title="Your Watchlist" />

          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 text-white">
            {movies
              .slice()
              .reverse()
              .map((movie) => (
                <Card
                  key={movie.id}
                  movie={movie}
                  cancel={true}
                  onRemoveFromWatchlist={removeFromWatchlist}
                />
              ))}
          </div>
        </>
      ) : (
        <div className="text-center text-xl text-gray-400">
          Your watchlist is empty.
        </div>
      )}
    </div>
  );
}
