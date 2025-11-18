'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Search, ChevronDown, Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AppHeader() {
  const [profileIcon, setProfileIcon] = useState('👨')

  useEffect(() => {
    // Get profile icon from localStorage
    const profiles = [
      { id: '1', icon: '👨' },
      { id: '2', icon: '👩' },
      { id: '3', icon: '🧒' }
    ]
    const selectedProfileId = localStorage.getItem('selectedProfile')
    const profile = profiles.find(p => p.id === selectedProfileId)
    if (profile) {
      setProfileIcon(profile.icon)
    }
  }, [])

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-6">
        <Link href="/home" className="flex items-center gap-2 flex-shrink-0">
          <Play className="h-8 w-8 text-primary fill-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            NextFlop
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
          <Link href="/home" className="text-foreground hover:text-primary transition-colors font-medium">
            Home
          </Link>
          <Link href="/movies" className="text-foreground hover:text-primary transition-colors font-medium">
            Movies
          </Link>
          <Link href="/shows" className="text-foreground hover:text-primary transition-colors font-medium">
            Shows
          </Link>
          <Link href="/genres" className="text-foreground hover:text-primary transition-colors font-medium">
            Genres
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {}}
            asChild
          >
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0 text-2xl hover:scale-105 transition-transform">
                {profileIcon}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/profiles/edit/current" className="cursor-pointer">
                  Editar perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/watch-later" className="cursor-pointer">
                  Más tarde
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/favorites" className="cursor-pointer">
                  Favoritos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/history" className="cursor-pointer">
                  Historial
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profiles" className="cursor-pointer">
                  Cambiar de perfil
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
