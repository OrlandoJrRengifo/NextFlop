'use client'

import { AppHeader } from '@/components/app-header'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Film } from 'lucide-react'

const genres = [
  { id: 'action', name: 'Acción', color: 'from-red-500/20 to-orange-500/20' },
  { id: 'comedy', name: 'Comedia', color: 'from-yellow-500/20 to-amber-500/20' },
  { id: 'romance', name: 'Romance', color: 'from-pink-500/20 to-rose-500/20' },
  { id: 'terror', name: 'Terror', color: 'from-purple-500/20 to-violet-500/20' },
  { id: 'thriller', name: 'Thriller', color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'suspense', name: 'Suspenso', color: 'from-indigo-500/20 to-blue-500/20' },
  { id: 'anime', name: 'Anime', color: 'from-fuchsia-500/20 to-pink-500/20' },
  { id: 'documentary', name: 'Documental', color: 'from-green-500/20 to-emerald-500/20' },
  { id: 'family', name: 'Familiar', color: 'from-teal-500/20 to-green-500/20' },
  { id: 'drama', name: 'Drama', color: 'from-slate-500/20 to-gray-500/20' },
  { id: 'sci-fi', name: 'Ciencia Ficción', color: 'from-cyan-500/20 to-blue-500/20' },
  { id: 'fantasy', name: 'Fantasía', color: 'from-violet-500/20 to-purple-500/20' },
  { id: 'adventure', name: 'Aventura', color: 'from-orange-500/20 to-red-500/20' },
  { id: 'musical', name: 'Musical', color: 'from-pink-500/20 to-fuchsia-500/20' },
  { id: 'western', name: 'Western', color: 'from-amber-500/20 to-yellow-500/20' },
]

export default function GenresPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Géneros</h1>
            <p className="text-lg text-muted-foreground">Explora contenido por categorías</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {genres.map((genre) => (
              <Link key={genre.id} href={`/genres/${genre.id}`}>
                <Card className={`p-6 bg-gradient-to-br ${genre.color} border-border hover:border-primary/50 transition-all hover:scale-105 cursor-pointer`}>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Film className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">{genre.name}</h2>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
