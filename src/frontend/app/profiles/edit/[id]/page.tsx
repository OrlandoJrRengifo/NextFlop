'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, ArrowLeft } from 'lucide-react'

const availableIcons = ['👨', '👩', '👦', '👧', '🧔', '👴', '👵', '🧒', '👶', '🐶', '🐱', '🦊']

import { apiAuthFetch } from '@/services/api'

export default function EditProfilePage() {
  const router = useRouter()
  const [profileName, setProfileName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('👨')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      try {
        // extract profile id from URL
        const path = window.location.pathname
        const id = path.split('/').pop()
        if (!id) return
        const data = await apiAuthFetch(`/api/users/profiles/${id}`)
        setProfileName(data?.name || '')
        setSelectedIcon(data?.icon || '👨')
      } catch (err) {
        console.error('Failed to load profile', err)
      }
    }
    loadProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const path = window.location.pathname
      const id = path.split('/').pop()
      if (id) {
        await apiAuthFetch(`/api/users/profiles/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: profileName, icon: selectedIcon }),
        })
      }
      alert('Perfil actualizado exitosamente')
      console.log('Profile updated', { profileName, selectedIcon })
    } catch (err) {
      console.error('Profile update failed', err)
      alert('Error al actualizar el perfil')
    }
    setIsLoading(false)
    router.push('/home')
  }

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

      <main className="container mx-auto px-4 py-16 max-w-lg">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Editar perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="profileName">Nombre del perfil</Label>
                <Input
                  id="profileName"
                  type="text"
                  placeholder="Ej: Juan"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                  maxLength={20}
                />
              </div>

              <div className="space-y-3">
                <Label>Icono del perfil</Label>
                <div className="grid grid-cols-6 gap-3">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`aspect-square rounded-lg flex items-center justify-center text-3xl transition-all ${
                        selectedIcon === icon
                          ? 'bg-primary/20 border-2 border-primary scale-110'
                          : 'bg-card border-2 border-border hover:border-primary/50 hover:scale-105'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
