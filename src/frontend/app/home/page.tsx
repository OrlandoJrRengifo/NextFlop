'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { HeroCarousel } from '@/components/hero-carousel'
import { ContentCarousel } from '@/components/content-carousel'
import { ContinueWatching } from '@/components/continue-watching'
import { MovieModal } from '@/components/movie-modal'

// Mock data
const recommendedItems = [
  { id: '1', title: 'Acción Extrema', image: '/action-movie.png' },
  { id: '2', title: 'Drama Intenso', image: '/intense-drama-scene.png' },
  { id: '3', title: 'Comedia Romántica', image: '/romantic-comedy.jpg' },
  { id: '4', title: 'Thriller Psicológico', image: '/psychological-thriller.jpg' },
  { id: '5', title: 'Sci-Fi Épico', image: '/epic-sci-fi.jpg' },
  { id: '6', title: 'Terror Nocturno', image: '/horror-movie.png' },
]

const trendingItems = [
  { id: '7', title: 'En Tendencia 1', image: '/epic-movie-scene.jpg' },
  { id: '8', title: 'En Tendencia 2', image: '/new-movie-release.jpg' },
  { id: '9', title: 'En Tendencia 3', image: '/trending-movie-3.jpg' },
  { id: '10', title: 'En Tendencia 4', image: '/trending-movie-4.jpg' },
  { id: '11', title: 'En Tendencia 5', image: '/trending-movie-5.jpg' },
  { id: '12', title: 'En Tendencia 6', image: '/trending-movie-6.jpg' },
]

const popularItems = [
  { id: '13', title: 'Popular 1', image: '/dramatic-tv-series.png' },
  { id: '14', title: 'Popular 2', image: '/popular-series-2.jpg' },
  { id: '15', title: 'Popular 3', image: '/popular-movie-3.jpg' },
  { id: '16', title: 'Popular 4', image: '/popular-movie-4.jpg' },
  { id: '17', title: 'Popular 5', image: '/popular-movie-5.jpg' },
  { id: '18', title: 'Popular 6', image: '/popular-movie-6.jpg' },
]

const acclaimedItems = [
  { id: '19', title: 'Aclamada 1', image: '/documentary-scene.png' },
  { id: '20', title: 'Aclamada 2', image: '/acclaimed-movie-2.jpg' },
  { id: '21', title: 'Aclamada 3', image: '/acclaimed-movie-3.jpg' },
  { id: '22', title: 'Aclamada 4', image: '/acclaimed-movie-4.jpg' },
  { id: '23', title: 'Aclamada 5', image: '/acclaimed-movie-5.jpg' },
  { id: '24', title: 'Aclamada 6', image: '/placeholder.svg?height=450&width=300' },
]

const newReleases = [
  { id: '25', title: 'Nuevo 1', image: '/placeholder.svg?height=450&width=300' },
  { id: '26', title: 'Nuevo 2', image: '/placeholder.svg?height=450&width=300' },
  { id: '27', title: 'Nuevo 3', image: '/placeholder.svg?height=450&width=300' },
  { id: '28', title: 'Nuevo 4', image: '/placeholder.svg?height=450&width=300' },
  { id: '29', title: 'Nuevo 5', image: '/placeholder.svg?height=450&width=300' },
  { id: '30', title: 'Nuevo 6', image: '/placeholder.svg?height=450&width=300' },
]

export default function HomePage() {
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleItemClick = (id: string) => {
    // Mock movie data
    setSelectedMovie({
      id,
      title: 'Película Ejemplo',
      description: 'Una historia emocionante llena de acción, drama y suspenso. Esta película te mantendrá al borde de tu asiento desde el primer minuto hasta el último.',
      genre: 'Acción, Drama',
      year: '2025',
      image: '/epic-movie-scene.jpg',
    })
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-16">
        <div className="space-y-8 pb-12">
          {/* Hero Carousel - Full width */}
          <HeroCarousel />

          {/* Content sections with container */}
          <div className="container mx-auto px-4 space-y-8">
            {/* Continue Watching Section */}
            <ContinueWatching />

            {/* Recommended Section */}
            <ContentCarousel
              title="Recomendado para ti"
              items={recommendedItems}
              onItemClick={handleItemClick}
            />

            {/* Trending Section */}
            <ContentCarousel
              title="En tendencia"
              items={trendingItems}
              onItemClick={handleItemClick}
            />

            {/* Popular This Week */}
            <ContentCarousel
              title="Populares esta semana"
              items={popularItems}
              onItemClick={handleItemClick}
            />

            {/* Acclaimed */}
            <ContentCarousel
              title="Aclamadas por la crítica"
              items={acclaimedItems}
              onItemClick={handleItemClick}
            />

            {/* New Releases */}
            <ContentCarousel
              title="Nuevas en la plataforma"
              items={newReleases}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </main>

      {/* Movie Modal */}
      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedMovie}
      />
    </div>
  )
}
