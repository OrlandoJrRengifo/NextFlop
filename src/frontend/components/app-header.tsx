'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Play, Search, Settings, LogOut, User, Users, Clock, Heart, History } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { apiAuthFetch, clearAuthToken } from '../services/api' 

interface Profile {
  id: string;
  name: string;
  iconUrl: string;
}

export function AppHeader() {
  const router = useRouter()
  const [profileIcon, setProfileIcon] = useState('👤')
  const [profileId, setProfileId] = useState<string | null>(null)

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      const selectedId = typeof window !== 'undefined' ? localStorage.getItem('selectedProfile') : null
      
      if (!selectedId) return

      setProfileId(selectedId)

      try {
        const profile = await apiAuthFetch<Profile>(`/api/profiles/${selectedId}`)
        if (profile && profile.iconUrl) {
          setProfileIcon(profile.iconUrl)
        }
      } catch (error) {
        console.error("Error obteniendo datos del perfil:", error)
      }
    }

    fetchCurrentProfile()
  }, [])

  const handleLogout = () => {
    clearAuthToken()
    localStorage.removeItem('selectedProfile')
    router.push('/login')
  }

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
          <Button variant="ghost" size="icon" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0 text-2xl hover:scale-105 transition-transform overflow-hidden border border-border/50">
                <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                  {profileIcon}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {profileId && (
                <DropdownMenuItem asChild>
                  <Link href={`/profiles/edit/${profileId}`} className="cursor-pointer flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Editar perfil
                  </Link>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              {/* --- ENLACES RESTAURADOS --- */}
              <DropdownMenuItem asChild>
                <Link href="/watch-later" className="cursor-pointer flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Más tarde
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/favorites" className="cursor-pointer flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favoritos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/history" className="cursor-pointer flex items-center gap-2">
                  <History className="h-4 w-4" />
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
                <Link href="/profiles" className="cursor-pointer flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Cambiar de perfil
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}