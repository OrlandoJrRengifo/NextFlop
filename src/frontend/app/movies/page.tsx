'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { ContentCarousel } from '@/components/content-carousel'
import { MovieModal } from '@/components/movie-modal'

// Mock data for movies
const recommendedMovies = [
  { id: '1', title: 'Acción Explosiva', image: '/action-movie.png' },
  { id: '2', title: 'Drama Profundo', image: '/intense-drama-scene.png' },
  { id: '3', title: 'Comedia Divertida', image: '/placeholder.svg?height=450&width=300' },
  { id: '4', title: 'Suspenso Total', image: '/placeholder.svg?height=450&width=300' },
  { id: '5', title: 'Romance Épico', image: '/placeholder.svg?height=450&width=300' },
  { id: '6', title: 'Aventura Increíble', image: '/placeholder.svg?height=450&width=300' },
]

const acclaimedMovies = [
  { id: '7', title: 'Clásico Atemporal', image: '/epic-movie-scene.jpg' },
  { id: '8', title: 'Obra Maestra', image: '/new-movie-release.jpg' },
  { id: '9', title: 'Premiada Internacional', image: '/placeholder.svg?height=450&width=300' },
  { id: '10', title: 'Aclamada por Críticos', image: '/placeholder.svg?height=450&width=300' },
  { id: '11', title: 'Favorita del Público', image: '/placeholder.svg?height=450&width=300' },
  { id: '12', title: 'Ganadora Oscar', image: '/placeholder.svg?height=450&width=300' },
]

const recentMovies = [
  { id: '13', title: 'Estreno 2025', image: '/placeholder.svg?height=450&width=300' },
  { id: '14', title: 'Recién Llegada', image: '/placeholder.svg?height=450&width=300' },
  { id: '15', title: 'Lanzamiento Especial', image: '/placeholder.svg?height=450&width=300' },
  { id: '16', title: 'Nuevo Blockbuster', image: '/placeholder.svg?height=450&width=300' },
  { id: '17', title: 'Fresh Release', image: '/placeholder.svg?height=450&width=300' },
  { id: '18', title: 'Just Dropped', image: '/placeholder.svg?height=450&width=300' },
]

const popularMovies = [
  { id: '19', title: 'Trending #1', image: '/placeholder.svg?height=450&width=300' },
  { id: '20', title: 'Top Viewed', image: '/placeholder.svg?height=450&width=300' },
  { id: '21', title: 'Fan Favorite', image: '/placeholder.svg?height=450&width=300' },
  { id: '22', title: 'Viral Hit', image: '/placeholder.svg?height=450&width=300' },
  { id: '23', title: 'Must Watch', image: '/placeholder.svg?height=450&width=300' },
  { id: '24', title: 'Everyone Talking', image: '/placeholder.svg?height=450&width=300' },
]

const classicMovies = [
  { id: '25', title: 'Clásico 80s', image: '/placeholder.svg?height=450&width=300' },
  { id: '26', title: 'Golden Age', image: '/placeholder.svg?height=450&width=300' },
  { id: '27', title: 'Retro Gem', image: '/placeholder.svg?height=450&width=300' },
  { id: '28', title: 'Vintage Classic', image: '/placeholder.svg?height=450&width=300' },
  { id: '29', title: 'Old School', image: '/placeholder.svg?height=450&width=300' },
  { id: '30', title: 'Timeless', image: '/placeholder.svg?height=450&width=300' },
]

export default function MoviesPage() {
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleItemClick = (id: string) => {
    setSelectedMovie({
      id,
      title: 'Película Ejemplo',
      description: 'Una película increíble que te atrapará desde el primer momento. Con actuaciones excepcionales y una trama envolvente.',
      genre: 'Drama, Acción',
      year: '2025',
      image: '/epic-movie-scene.jpg',
    })
    setIsModalOpen(true)
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
          <ContentCarousel
            title="Recomendado en películas"
            items={recommendedMovies}
            onItemClick={handleItemClick}
          />

          <ContentCarousel
            title="Películas aclamadas"
            items={acclaimedMovies}
            onItemClick={handleItemClick}
          />

          <ContentCarousel
            title="Películas recientes"
            items={recentMovies}
            onItemClick={handleItemClick}
          />

          <ContentCarousel
            title="Películas populares"
            items={popularMovies}
            onItemClick={handleItemClick}
          />

          <ContentCarousel
            title="Clásicos imperdibles"
            items={classicMovies}
            onItemClick={handleItemClick}
          />
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
