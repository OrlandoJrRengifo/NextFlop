'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Heart, Trash2, Play } from 'lucide-react'
import { ActionPopup } from '@/components/action-popup'
import { ConfirmationDialog } from '@/components/confirmation-dialog'

// Mock data
const mockFavorites = [
  { id: '1', title: 'Acción Extrema', image: '/action-movie.png', addedDate: '2025-01-15', rating: 4.8 },
  { id: '2', title: 'Drama Intenso', image: '/intense-drama-scene.png', addedDate: '2025-01-14', rating: 4.5 },
  { id: '3', title: 'Comedia Romántica', image: '/romantic-comedy.jpg', addedDate: '2025-01-13', rating: 4.2 },
  { id: '4', title: 'Thriller Psicológico', image: '/psychological-thriller.jpg', addedDate: '2025-01-12', rating: 4.7 },
  { id: '5', title: 'Sci-Fi Épico', image: '/epic-sci-fi.jpg', addedDate: '2025-01-10', rating: 4.9 },
  { id: '6', title: 'Terror Nocturno', image: '/horror-movie.png', addedDate: '2025-01-08', rating: 4.3 },
  { id: '7', title: 'Aventura Fantástica', image: '/epic-movie-scene.jpg', addedDate: '2025-01-05', rating: 4.6 },
  { id: '8', title: 'Romance Histórico', image: '/dramatic-tv-series.png', addedDate: '2025-01-03', rating: 4.4 },
]

export default function FavoritesPage() {
  const [items, setItems] = useState(mockFavorites)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<string | null>(null)

  const handleRemove = (id: string) => {
    setItemToRemove(id)
    setShowConfirmDialog(true)
  }

  const confirmRemove = () => {
    if (itemToRemove) {
      setItems(items.filter(item => item.id !== itemToRemove))
      setPopupMessage('Eliminado de Favoritos')
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 3000)
      setItemToRemove(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
              <Heart className="h-6 w-6 text-red-500 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Favoritos</h1>
              <p className="text-muted-foreground">{items.length} {items.length === 1 ? 'título' : 'títulos'} favoritos</p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">No tienes favoritos</h2>
              <p className="text-muted-foreground max-w-md">
                Marca tus películas y series favoritas para tenerlas siempre a mano
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {items.map((item) => (
                <div key={item.id} className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="icon" className="h-12 w-12 rounded-full">
                        <Play className="h-5 w-5 fill-current" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="h-12 w-12 rounded-full"
                        onClick={() => handleRemove(item.id)}
                      >
                        <Heart className="h-5 w-5 fill-current" />
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      {item.rating}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Heart className="h-5 w-5 text-red-500 fill-current" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Agregado el {new Date(item.addedDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <ActionPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        message={popupMessage}
        type="error"
        icon="heart"
      />

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmRemove}
        title="Eliminar de Favoritos"
        description="¿Estás seguro de que quieres eliminar este título de tus favoritos?"
        confirmText="Eliminar"
        variant="destructive"
      />
    </div>
  )
}
