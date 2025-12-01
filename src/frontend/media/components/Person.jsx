"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Carousel } from "./Carousel";
import MovieCategoryName from "./MovieCategoryName";
import { MdArrowBack } from "react-icons/md";
import Loader from "./Loader";
import { toast } from "sonner";

export default function Person() {
  const { id } = useParams();
  const router = useRouter();

  const [person, setPerson] = useState(null);
  const [combined, setCombined] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const goBack = () => {
    router.back();
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "Unknown";

    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [personRes, combinedRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}`),
          fetch(
            `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${apiKey}`
          ),
        ]);

        const personData = await personRes.json();
        const combinedData = await combinedRes.json();

        setPerson(personData);
        setCombined(combinedData.cast || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load person details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, apiKey]);

  if (loading) return <Loader color="gray" loading size={20} />;

  if (!person) {
    return (
      <div className="text-center py-20 text-red-400">
        No person data available.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[300px_auto] gap-5 p-5 lg:py-8 bg-gradient-to-l from-zinc-900 to-black">
        {/* Image */}
        <div>
          <img
            src={
              person.profile_path
                ? `https://image.tmdb.org/t/p/original/${person.profile_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={person.name}
            className="w-full rounded"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-3 items-start">
          <div
            onClick={goBack}
            className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white"
          >
            <MdArrowBack size={20} />
            Back To Main
          </div>

          <h1 className="text-3xl font-bold text-white">{person.name}</h1>

          <p className="text-base lg:text-lg leading-relaxed max-h-80 overflow-auto text-gray-300">
            {person.biography || "No biography available."}
          </p>

          <p className="text-gray-300">
            <strong>Born:</strong>{" "}
            {person.birthday || "Unknown"}{" "}
            {person.birthday && ` (${calculateAge(person.birthday)} years)`}{" "}
            {person.place_of_birth && ` in ${person.place_of_birth}`}
          </p>
        </div>
      </div>

      {/* Known For */}
      <div className="container mx-auto px-4">
        <MovieCategoryName title="Known For" />
        <Carousel movies={combined} />
      </div>
    </>
  );
}
