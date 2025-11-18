'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { ContentCarousel } from '@/components/content-carousel'
import { MovieModal } from '@/components/movie-modal'

// Mock data for shows
const recommendedShows = [
  { id: '1', title: 'Serie Drama', image: '/dramatic-tv-series.png' },
  { id: '2', title: 'Comedia Sitcom', image: '/placeholder.svg?height=450&width=300' },
  { id: '3', title: 'Thriller Serie', image: '/placeholder.svg?height=450&width=300' },
  { id: '4', title: 'Sci-Fi Show', image: '/placeholder.svg?height=450&width=300' },
  { id: '5', title: 'Drama Médico', image: '/placeholder.svg?height=450&width=300' },
  { id: '6', title: 'Serie Policiaca', image: '/placeholder.svg?height=450&width=300' },
]

const popularShows = [
  { id: '7', title: 'Top Serie #1', image: '/placeholder.svg?height=450&width=300' },
  { id: '8', title: 'Trending Show', image: '/placeholder.svg?height=450&width=300' },
  { id: '9', title: 'Binge Worthy', image: '/placeholder.svg?height=450&width=300' },
  { id: '10', title: 'Fan Loved', image: '/placeholder.svg?height=450&width=300' },
  { id: '11', title: 'Must See', image: '/placeholder.svg?height=450&width=300' },
  { id: '12', title: 'Viral Series', image: '/placeholder.svg?height=450&width=300' },
]

const newShows = [
  { id: '13', title: 'Nueva Temporada', image: '/placeholder.svg?height=450&width=300' },
  { id: '14', title: 'Fresh Series', image: '/placeholder.svg?height=450&width=300' },
  { id: '15', title: 'Just Premiered', image: '/placeholder.svg?height=450&width=300' },
  { id: '16', title: 'Latest Drop', image: '/placeholder.svg?height=450&width=300' },
  { id: '17', title: 'New Episodes', image: '/placeholder.svg?height=450&width=300' },
  { id: '18', title: 'Recent Show', image: '/placeholder.svg?height=450&width=300' },
]

const miniSeries = [
  { id: '19', title: 'Miniserie 1', image: '/placeholder.svg?height=450&width=300' },
  { id: '20', title: 'Limited Series', image: '/placeholder.svg?height=450&width=300' },
  { id: '21', title: 'Short Run', image: '/placeholder.svg?height=450&width=300' },
  { id: '22', title: 'Mini Drama', image: '/placeholder.svg?height=450&width=300' },
  { id: '23', title: 'Quick Watch', image: '/placeholder.svg?height=450&width=300' },
  { id: '24', title: 'Compact Series', image: '/placeholder.svg?height=450&width=300' },
]

const top10Shows = [
  { id: '25', title: 'Top 10 #1', image: '/placeholder.svg?height=450&width=300' },
  { id: '26', title: 'Top 10 #2', image: '/placeholder.svg?height=450&width=300' },
  { id: '27', title: 'Top 10 #3', image: '/placeholder.svg?height=450&width=300' },
  { id: '28', title: 'Top 10 #4', image: '/placeholder.svg?height=450&width=300' },
  { id: '29', title: 'Top 10 #5', image: '/placeholder.svg?height=450&width=300' },
  { id: '30', title: 'Top 10 #6', image: '/placeholder.svg?height=450&width=300' },
]

export default function ShowsPage() {
  const [selectedShow, setSelectedShow] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleItemClick = (id: string) => {
    setSelectedShow({
      id,
      title: 'Serie Ejemplo',
      description: 'Una serie emocionante con múltiples temporadas que te mantendrá enganchado episodio tras episodio.',
      genre: 'Drama, Thriller',
      year: '2024-2025',
      image: '/dramatic-tv-series.png',
    })
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 space-y-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Series</h1>
            <p className="text-lg text-muted-foreground">Encuentra tu próxima serie favorita</p>
          </div>

          {/* Shows Sections */}
          <ContentCarousel
            title="Series recomendadas"
            items={recommendedShows}
            onItemClick={handleItemClick}
          />

          <ContentCarousel
            title="Series populares"
            items={popularShows}
            onItemClick={handleItemClick}
          />

          <ContentCarousel
            title="Series nuevas"
            items={newShows}
            onItemClick={handleItemClick}
          />

          <ContentCarousel
            title="Miniseries"
            items={miniSeries}
            onItemClick={handleItemClick}
          />

          <ContentCarousel
            title="Top 10 de la semana"
            items={top10Shows}
            onItemClick={handleItemClick}
          />
        </div>
      </main>

      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedShow}
      />
    </div>
  )
}
