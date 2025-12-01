const IMG = "https://image.tmdb.org/t/p";

export const mapTMDB = (item: any) => ({
  id: item.id,
  title: item.title || item.name,
  image: item.poster_path
    ? `${IMG}/w500${item.poster_path}`
    : "/placeholder.jpg",
  backdrop: item.backdrop_path
    ? `${IMG}/original${item.backdrop_path}`
    : "/placeholder.jpg",
  description: item.overview,
  year:
    item.release_date?.slice(0, 4) ||
    item.first_air_date?.slice(0, 4),
  media_type: item.media_type || (item.title ? "movie" : "tv"),
});
