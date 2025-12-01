"use client";

import React, { useEffect, useState } from "react";
import { MovieSkeleton } from "./MovieSkeletion";
import { Carousel } from "./Carousel";
import MovieCategoryName from "./MovieCategoryName";
import { toast } from "sonner";

const fetchWithTimeout = async (url, options = {}, timeout = 25000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    ),
  ]);
};

export default function MovieCarousel() {
  const [movies, setMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiKey) {
      const errorMessage =
        "API Key is missing. Ensure NEXT_PUBLIC_API_KEY is defined.";
      console.error(errorMessage);
      toast("API Error", {
        type: "error",
        description: errorMessage,
      });
      setError(errorMessage);
      setLoading(false);
      return;
    }

    const endpoints = [
      {
        key: "Trending Movies Today",
        url: "/trending/movie/day",
      },
      {
        key: "Sci-Fi Movies",
        url: "/discover/movie?sort_by=revenue.desc&with_genres=878",
      },
      {
        key: "Tamil Action Movies",
        url:
          "/discover/movie?sort_by=revenue.desc" +
          "&with_original_language=te&with_genres=28",
      },
      {
        key: "Popular Hindi Movies",
        url:
          "/discover/movie?sort_by=popularity.desc" +
          "&with_original_language=hi&region=IN",
      },
      {
        key: "Most Popular Movies",
        url: "/movie/popular",
      },
      {
        key: "Top Rated Movies Globally",
        url: "/movie/top_rated",
      },
      {
        key: "Upcoming Movie Releases",
        url: "/movie/upcoming",
      },
    ];

    try {
      const fetchPromises = endpoints.map(async ({ key, url }) => {
        try {
          const separator = url.includes("?") ? "&" : "?";
          const fullUrl = `https://api.themoviedb.org/3${url}${separator}api_key=${apiKey}`;

          const response = await fetchWithTimeout(fullUrl, {}, 10000);

          if (!response.ok) {
            const errorMessage = `Failed to fetch ${key} movies: ${response.statusText}`;
            console.error(errorMessage);
            toast("Network Error", {
              description: `Error fetching ${key} movies`,
              type: "error",
            });
            throw new Error(errorMessage);
          }

          const data = await response.json();
          return { key, data: data.results || [] };
        } catch (err) {
          console.error(`Error fetching ${key} movies:`, err);
          toast(`Error fetching ${key} movies.`, {
            description: err.message,
            type: "error",
          });
          return { key, data: [] };
        }
      });

      const movieData = await Promise.all(fetchPromises);
      const newMovies = movieData.reduce((acc, { key, data }) => {
        acc[key] = data;
        return acc;
      }, {});

      setMovies(newMovies);
    } catch (globalError) {
      const errorMessage = "Error fetching movie data. Please try again.";
      console.error(errorMessage, globalError);
      toast(errorMessage, {
        description: "Something went wrong with the network",
        type: "error",
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="px-4 mb-8 py-1">
        <MovieSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-1">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {Object.entries(movies).map(([key, movieList]) => (
        <div className="pb-4" key={key}>
          <MovieCategoryName
            title={key}
            // importante: ruta de Next con el prefijo /reactflix
            linkTo={`/reactflix/movies/${encodeURIComponent(key)}`}
          />

          {movieList.length > 0 ? (
            <Carousel movies={movieList} />
          ) : (
            <p>No {key} movies available.</p>
          )}
        </div>
      ))}
    </div>
  );
}
