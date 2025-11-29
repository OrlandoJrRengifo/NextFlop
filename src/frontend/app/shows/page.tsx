'use client'

import { useEffect, useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { ContentCarousel } from '@/components/content-carousel'
import { MovieModal } from '@/components/movie-modal'

import { apiFetch } from '@/services/api'

const EMPTY: any[] = []

export default function ShowsPage() {
  const [selectedShow, setSelectedShow] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [recommendedShows, setRecommendedShows] = useState<any[]>(EMPTY)
  const [popularShows, setPopularShows] = useState<any[]>(EMPTY)
  const [newShows, setNewShows] = useState<any[]>(EMPTY)
  const [miniSeries, setMiniSeries] = useState<any[]>(EMPTY)
  const [top10Shows, setTop10Shows] = useState<any[]>(EMPTY)

  useEffect(() => {
    async function load() {
      try {
        const [rec, popular, newR, top] = await Promise.all([
          apiFetch('/api/media?limit=6'),
          apiFetch('/api/media/popular?limit=6'),
          apiFetch('/api/media/new-releases?limit=6'),
          apiFetch('/api/media/popular?limit=6'),
        ])

        setRecommendedShows(rec.items || rec.media || [])
        setPopularShows(popular.items || popular.media || [])
        setNewShows(newR.items || newR.media || [])
        setMiniSeries([])
        setTop10Shows(top.items || top.media || [])
      } catch (err) {
        console.error('Failed to load shows lists', err)
      }
    }
    load()
  }, [])

  const handleItemClick = async (id: string) => {
    try {
      const m = await apiFetch(`/api/media/${id}`)
      setSelectedShow(m)
      setIsModalOpen(true)
    } catch (err) {
      console.error('Failed to fetch show details', err)
    }
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
          <ContentCarousel title="Series recomendadas" items={recommendedShows} onItemClick={handleItemClick} />

          <ContentCarousel title="Series populares" items={popularShows} onItemClick={handleItemClick} />

          <ContentCarousel title="Series nuevas" items={newShows} onItemClick={handleItemClick} />

          <ContentCarousel title="Miniseries" items={miniSeries} onItemClick={handleItemClick} />

          <ContentCarousel title="Top 10 de la semana" items={top10Shows} onItemClick={handleItemClick} />
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
