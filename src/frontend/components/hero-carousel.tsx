"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Clock, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { ActionPopup } from '@/components/action-popup'
import { apiFetch } from '@/services/api'

interface HeroCarouselProps {
  onItemClick?: (id: string) => void
}

const DEFAULT_SLIDES: any[] = []

export function HeroCarousel({ onItemClick }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<any[]>(DEFAULT_SLIDES)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [popupIcon, setPopupIcon] = useState<'heart' | 'clock'>('heart')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    let mounted = true

    async function loadSlides() {
      try {
        const res = await apiFetch('/api/media?limit=6')
        const items = res.items || res.media || []
        if (mounted) setSlides(items.slice(0, 3))
      } catch (err) {
        // ignore error and keep default slides
      }
    }

    loadSlides()

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.max(1, slides.length))
    }, 5000)

    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, slides.length))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, slides.length)) % Math.max(1, slides.length))
  }

  const handleAddToWatchLater = (title: string) => {
    setPopupMessage(`"${title}" agregado a Ver más tarde`)
    setPopupIcon('clock')
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 3000)
  }

  const handleToggleFavorite = (id: string, title: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
      setPopupMessage(`"${title}" eliminado de Favoritos`)
    } else {
      newFavorites.add(id)
      setPopupMessage(`"${title}" agregado a Favoritos`)
    }
    setFavorites(newFavorites)
    setPopupIcon('heart')
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 3000)
  }

  return (
    <>
      <div className="relative w-full h-[70vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl text-pretty">
                {slide.description}
              </p>
              <div className="flex gap-3">
                <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => onItemClick?.(slide.id)}>
                  <Play className="h-5 w-5 mr-2 fill-current" />
                  Ver ahora
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => handleAddToWatchLater(slide.title)}
                >
                  <Clock className="h-5 w-5 mr-2" />
                  Más tarde
                </Button>
                <Button 
                  size="lg" 
                  variant={favorites.has(slide.id) ? "default" : "outline"}
                  onClick={() => handleToggleFavorite(slide.id, slide.title)}
                  className={favorites.has(slide.id) ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <Heart className={`h-5 w-5 ${favorites.has(slide.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-primary w-8' : 'bg-muted-foreground/50 w-2'
              }`}
            />
          ))}
        </div>
      </div>

      <ActionPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        message={popupMessage}
        type="success"
        icon={popupIcon}
      />
    </>
  )
}
