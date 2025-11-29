 'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Play, ArrowLeft, History } from 'lucide-react'
import { apiAuthFetch } from '@/services/api'

export default function HistoryPage() {
  const router = useRouter()

  const [historyItems, setHistoryItems] = useState<any[]>([])

  useEffect(() => {
    async function loadHistory() {
      try {
        const user = await apiAuthFetch('/api/users/me')
        const raw = user?.history || []
        const normalized = raw.map((h: any, i: number) => (typeof h === 'string' ? { id: h, title: `Item ${h}`, date: null, progress: 0 } : {
          id: h.id || h.mediaId || String(i),
          title: h.title || h.name || h.mediaTitle || 'Sin título',
          date: h.watchedAt || h.date || null,
          progress: h.progress || h.watchedPercent || 0,
          image: h.image || h.posterUrl || h.thumbnail || undefined,
        }))

        setHistoryItems(normalized)
      } catch (err) {
        setHistoryItems([])
      }
    }

    loadHistory()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Play className="h-8 w-8 text-primary fill-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              NextFlop
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <History className="h-10 w-10 text-accent" />
          <h1 className="text-4xl font-bold">Historial de visualización</h1>
        </div>

        <div className="space-y-4">
          {historyItems.map((item) => (
            <Card key={item.id} className="bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-border flex-shrink-0">
                    <img
                      src={`/thumbnail-.jpg?height=120&width=192&query=thumbnail+${item.id}`}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.date}</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    {item.progress === 100 ? 'Ver de nuevo' : 'Continuar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
