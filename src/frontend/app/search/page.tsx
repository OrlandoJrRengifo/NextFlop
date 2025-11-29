'use client'

import { useEffect, useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { Input } from '@/components/ui/input'
import { Search, TrendingUp } from 'lucide-react'
import { MovieModal } from '@/components/movie-modal'

import { apiAuthFetch, apiFetch } from '@/services/api'

// suggestions and results come from backend

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    async function loadSuggestions() {
      try {
        const res = await apiFetch('/api/media/popular?limit=8')
        setSuggestions(res.items || res.media || [])
      } catch (err) {
        console.error('Failed to load suggestions', err)
        setSuggestions([])
      }
    }
    loadSuggestions()
  }, [])

  useEffect(() => {
    let timer: any
    if (searchQuery && searchQuery.trim().length > 0) {
      timer = setTimeout(async () => {
        try {
          const res = await apiFetch(`/api/media/search?query=${encodeURIComponent(searchQuery)}&limit=24`)
          setResults(res.items || res.media || [])
        } catch (err) {
          console.error('Search failed', err)
          setResults([])
        }
      }, 300)
    } else {
      setResults([])
    }
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSuggestionClick = (text: string) => {
    setSearchQuery(text)
  }

  const handleResultClick = async (item: any) => {
    try {
      const m = await apiFetch(`/api/media/${item.id}`)
      setSelectedMovie(m)
      setIsModalOpen(true)
    } catch (err) {
      console.error('Failed to fetch item details', err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Busca películas, series o géneros..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Suggestions */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-4">Sugerencias</h2>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion.title || suggestion.text)}
                    className="w-full text-left p-4 rounded-lg bg-card/50 hover:bg-card border border-border hover:border-primary/50 transition-all flex items-center gap-3"
                  >
                    <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{suggestion.title || suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2">
              {searchQuery ? (
                <>
                  <h2 className="text-2xl font-bold mb-4">
                    Resultados para "{searchQuery}"
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {results.map((item) => (
                      <div
                        key={item.id}
                        className="cursor-pointer group"
                        onClick={() => handleResultClick(item)}
                      >
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 transition-transform group-hover:scale-105">
                          <img
                            src={item.posterUrl || item.image || "/placeholder.svg"}
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
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-center">
                  <div>
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">
                      Busca películas, series o géneros
                    </p>
                  </div>
                </div>
              )}
            </div>
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
