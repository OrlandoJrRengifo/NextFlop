import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/media/components/ui/dialog";
import { Input } from "@/media/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GoSearch } from "react-icons/go";

export default function Search({ size }) {
  const [open, setOpen] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const router = useRouter();

  // ========================
  // Fetch movies
  // ========================
  const fetchMovies = async (q) => {
    if (!q) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
          q
        )}`
      );

      if (!res.ok) {
        toast.error("Something went wrong.");
        return;
      }

      const data = await res.json();

      // Only movies with posters
      const movies = (data.results || []).filter(
        (m) => m.poster_path != null
      );

      setSuggestions(movies);
    } catch (err) {
      toast.error("Failed to fetch movies.", {
        description: err.message,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // Input change
  // ========================
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchMovies(value);
  };

  // ========================
  // Keyboard navigation
  // ========================
  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        Math.min(prev + 1, suggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      const m = suggestions[focusedIndex];
      if (!m) return;

      router.push(`/reactflix/movie/${m.id}`);
      setOpen(false);
    }
  };

  // ========================
  // Shortcut CTRL+J
  // ========================
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* Trigger */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="cursor-pointer" onClick={() => setOpen(true)}>
            <GoSearch size={size} />
          </div>
        </DialogTrigger>

        {/* Search Box */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Movies</DialogTitle>
          </DialogHeader>

          <Input
            type="text"
            value={query}
            placeholder="Type a movie name..."
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full mt-2 mb-3"
          />

          {/* Results */}
          {suggestions.length === 0 ? (
            <p className="text-center text-gray-500">No results found.</p>
          ) : (
            <div className="mt-2 max-h-64 overflow-y-auto">
              {suggestions.map((movie, index) => {
                const poster = `https://image.tmdb.org/t/p/w92${movie.poster_path}`;
                const year = movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "N/A";

                const isFocused = index === focusedIndex;

                return (
                  <Link
                    href={`/reactflix/movie/${movie.id}`}
                    key={movie.id}
                    onClick={() => setOpen(false)}
                    className={`flex items-center p-2 rounded-md cursor-pointer ${
                      isFocused
                        ? "bg-zinc-800"
                        : "hover:bg-zinc-800"
                    }`}
                  >
                    <img
                      src={poster}
                      alt={movie.title}
                      className="w-12 h-18 object-cover rounded mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium">{movie.title}</p>
                      <p className="text-xs text-gray-500">{year}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
