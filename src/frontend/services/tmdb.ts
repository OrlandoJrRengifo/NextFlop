const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY!;
const BASE_URL = "https://api.themoviedb.org/3";

export async function getPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`);
  const data = await res.json();
  return data.results;
}

export async function getPopularSeries() {
  const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=es-ES`);
  const data = await res.json();
  return data.results;
}

export async function getTrending() {
  const res = await fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}&language=es-ES`);
  const data = await res.json();
  return data.results;
}


const callTMDB = async (endpoint: string, params: any = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);

  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("language", "es-ES");

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  return res.json();
};

export const TMDB = {
  getPopularMovies: (page = 1) => callTMDB("/movie/popular", { page }),
  getPopularSeries: (page = 1) => callTMDB("/tv/popular", { page }),
  search: (query: string, page = 1) =>
    callTMDB("/search/multi", { query, page, include_adult: "false" }),
  getMovie: (id: string) => callTMDB(`/movie/${id}`),
  getShow: (id: string) => callTMDB(`/tv/${id}`),
  getSimilar: (id: string, type: "movie" | "tv") =>
    callTMDB(`/${type}/${id}/similar`),
};
