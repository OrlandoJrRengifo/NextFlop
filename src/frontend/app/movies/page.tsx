"use client"

import { useEffect, useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { ContentCarousel } from '@/components/content-carousel'
import { MovieModal } from '@/components/movie-modal'

import { apiFetch } from '@/services/api'

// live data only — replace mocks with backend calls

export default function MoviesPage() {
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [recommendedMovies, setRecommendedMovies] = useState<any[]>([])
  const [acclaimedMovies, setAcclaimedMovies] = useState<any[]>([])
  const [recentMovies, setRecentMovies] = useState<any[]>([])
  const [popularMovies, setPopularMovies] = useState<any[]>([])
  const [classicMovies, setClassicMovies] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      try {
        const [rec, acclaimed, recent, popular, classic] = await Promise.all([
          apiFetch('/api/media?limit=6'),
          apiFetch('/api/media?limit=6'),
          apiFetch('/api/media/new-releases?limit=6'),
          apiFetch('/api/media/popular?limit=6'),
          apiFetch('/api/media?limit=6'),
        ])

        setRecommendedMovies(rec.items || rec.media || [])
        setAcclaimedMovies(acclaimed.items || acclaimed.media || [])
        setRecentMovies(recent.items || recent.media || [])
        setPopularMovies(popular.items || popular.media || [])
        setClassicMovies(classic.items || classic.media || [])
      } catch (err) {
        console.error('Failed to load movies', err)
      }
    }

    load()
  }, [])

  const handleItemClick = async (id: string) => {
    try {
      const m = await apiFetch(`/api/media/${id}`)
      setSelectedMovie(m)
      setIsModalOpen(true)
    } catch (err) {
      console.error('Failed to fetch movie details', err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 space-y-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Películas</h1>
            <p className="text-lg text-muted-foreground">Descubre tu próxima película favorita</p>
          </div>

          {/* Movie Sections */}
          <ContentCarousel title="Recomendado en películas" items={recommendedMovies} onItemClick={handleItemClick} />

          <ContentCarousel title="Películas aclamadas" items={acclaimedMovies} onItemClick={handleItemClick} />

          <ContentCarousel title="Películas recientes" items={recentMovies} onItemClick={handleItemClick} />

          <ContentCarousel title="Películas populares" items={popularMovies} onItemClick={handleItemClick} />

          <ContentCarousel title="Clásicos imperdibles" items={classicMovies} onItemClick={handleItemClick} />
        </div>
      </main>

      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedMovie}
      />
    </div>
  )
}
