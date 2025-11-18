'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Play, ArrowLeft, Heart } from 'lucide-react'

export default function FavoritesPage() {
  const router = useRouter()

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

      <main className="container mx-auto px-4 py-16">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-10 w-10 text-secondary fill-secondary" />
          <h1 className="text-4xl font-bold">Favoritos</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded-lg bg-gradient-to-br from-secondary/10 to-accent/10 border border-border hover:border-secondary/50 hover:scale-105 transition-all cursor-pointer"
            >
              <img
                src={`/favorite-content-.jpg?height=450&width=300&query=favorite+content+${i}`}
                alt={`Favorite ${i}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
