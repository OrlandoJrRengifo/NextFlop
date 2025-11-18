'use client'

import { Play } from 'lucide-react'

const continueWatchingItems = [
  {
    id: '1',
    title: 'Película Ejemplo 1',
    image: '/action-movie.png',
    progress: 45,
  },
  {
    id: '2',
    title: 'Serie Ejemplo 2',
    image: '/intense-drama-scene.png',
    progress: 72,
  },
  {
    id: '3',
    title: 'Documental Ejemplo',
    image: '/documentary-scene.png',
    progress: 28,
  },
]

export function ContinueWatching() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Seguir viendo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {continueWatchingItems.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center">
                  <Play className="h-8 w-8 fill-primary-foreground" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
            <p className="text-sm font-medium group-hover:text-primary transition-colors">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
