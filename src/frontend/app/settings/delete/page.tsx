'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, ArrowLeft, AlertTriangle } from 'lucide-react'

export default function DeleteAccountPage() {
  const router = useRouter()
  const [confirmText, setConfirmText] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (confirmText !== 'ELIMINAR') {
      alert('Por favor escribe "ELIMINAR" para confirmar')
      return
    }

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('[v0] Account deleted')
    alert('Tu cuenta ha sido eliminada permanentemente')
    setIsLoading(false)
    router.push('/')
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

      <main className="container mx-auto px-4 py-16 max-w-2xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <Card className="bg-card/50 backdrop-blur-sm border-destructive">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Eliminar cuenta permanentemente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="font-semibold text-destructive mb-3">
                Esta acción es irreversible
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>Se eliminarán todos tus perfiles y preferencias</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>Perderás todo tu historial de visualización</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>Se eliminarán todos tus puntos acumulados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>No podrás recuperar esta cuenta ni sus datos</span>
                </li>
              </ul>
            </div>

            <form onSubmit={handleDelete} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirmText">
                  Escribe <span className="font-bold">ELIMINAR</span> para confirmar
                </Label>
                <Input
                  id="confirmText"
                  type="text"
                  placeholder="ELIMINAR"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Confirma tu contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
                  variant="destructive"
                  className="flex-1"
                  disabled={isLoading || confirmText !== 'ELIMINAR'}
                >
                  {isLoading ? 'Eliminando...' : 'Eliminar permanentemente'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
