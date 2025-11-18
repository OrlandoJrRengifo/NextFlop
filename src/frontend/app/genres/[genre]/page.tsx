'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { MovieModal } from '@/components/movie-modal'
import { useParams } from 'next/navigation'

// Mock data
const genreContent: Record<string, any[]> = {
  action: Array.from({ length: 24 }, (_, i) => ({
    id: `action-${i + 1}`,
    title: `Película de Acción ${i + 1}`,
    image: `/placeholder.svg?height=450&width=300&query=action+movie+${i + 1}`,
  })),
  comedy: Array.from({ length: 24 }, (_, i) => ({
    id: `comedy-${i + 1}`,
    title: `Comedia ${i + 1}`,
    image: `/placeholder.svg?height=450&width=300&query=comedy+movie+${i + 1}`,
  })),
  // Add more genres as needed
}

export default function GenrePage() {
  const params = useParams()
  const genre = params.genre as string
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const content = genreContent[genre] || []
  const genreName = genre.charAt(0).toUpperCase() + genre.slice(1)

  const handleItemClick = (item: any) => {
    setSelectedMovie({
      id: item.id,
      title: item.title,
      description: `Una increíble ${genreName.toLowerCase()} que te mantendrá entretenido de principio a fin.`,
      genre: genreName,
      year: '2025',
      image: item.image,
    })
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{genreName}</h1>
            <p className="text-lg text-muted-foreground">
              Explora todas las películas y series de {genreName.toLowerCase()}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {content.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer group"
                onClick={() => handleItemClick(item)}
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 transition-transform group-hover:scale-105">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
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
