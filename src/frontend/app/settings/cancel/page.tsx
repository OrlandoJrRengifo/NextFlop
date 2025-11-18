'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, ArrowLeft, AlertTriangle } from 'lucide-react'

export default function CancelSubscriptionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async () => {
    const confirmed = window.confirm('¿Estás seguro de que deseas cancelar tu suscripción?')
    if (!confirmed) return

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('[v0] Subscription cancelled')
    alert('Tu suscripción ha sido cancelada')
    setIsLoading(false)
    router.push('/login')
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

        <Card className="bg-card/50 backdrop-blur-sm border-destructive/50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Cancelar suscripción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="font-semibold">Al cancelar tu suscripción:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>Perderás acceso a todo el contenido al final de tu periodo de facturación actual</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>Se detendrán todos los cobros futuros</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>Perderás todos los puntos acumulados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>Se eliminarán todas las listas y preferencias guardadas</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm leading-relaxed">
                Tu suscripción permanecerá activa hasta el{' '}
                <span className="font-semibold">28 de febrero de 2025</span>. Puedes reactivarla
                en cualquier momento antes de esa fecha.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Mantener suscripción
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {isLoading ? 'Cancelando...' : 'Confirmar cancelación'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
