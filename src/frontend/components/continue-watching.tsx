'use client'

import { useEffect, useState } from 'react'
import { Play } from 'lucide-react'
import { apiAuthFetch, apiFetch } from '@/services/api'

interface ContinueWatchingProps {
  onItemClick?: (itemId: string) => void
}

export function ContinueWatching({ onItemClick }: ContinueWatchingProps) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadHistory() {
      setLoading(true)
      try {
        const user = await apiAuthFetch('/api/users/me')
        // user.history can be a list of objects or ids. Prefer objects with metadata.
        const history = user?.history || []
        // try to normalize items to { id, title, image, progress }
        const normalized = await Promise.all(history.map(async (h: any, i: number) => {
          // if history entry is a string id, fetch metadata from media endpoint
          if (typeof h === 'string') {
            try {
              const body = await apiFetch(`/api/media/${encodeURIComponent(h)}`)
              const m = body.item || body.media || body
              return {
                id: h,
                title: m.title || m.name || `#${h}`,
                image: m.image || m.posterUrl || m.thumbnail || '/placeholder.svg',
                progress: m.progress || 0,
                watchedAt: m.watchedAt || null,
              }
            } catch (err) {
              return { id: h, title: `#${h}`, image: '/placeholder.svg', progress: 0 }
            }
          }

          return {
            id: h.id || h.mediaId || String(i),
            title: h.title || h.name || h.mediaTitle || 'Sin título',
            image: h.image || h.posterUrl || h.thumbnail || '/placeholder.svg',
            progress: h.progress || h.watchedPercent || 0,
            watchedAt: h.watchedAt || h.date || null,
          }
        }))

        setItems(normalized)
      } catch (err) {
        // quietly ignore if not authenticated or backend not available
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  if (loading) return null

  if (!items || items.length === 0) return null

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Seguir viendo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer"
            onClick={() => onItemClick?.(item.id)}
          >
            <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
              <img
                src={item.image || '/placeholder.svg'}
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
