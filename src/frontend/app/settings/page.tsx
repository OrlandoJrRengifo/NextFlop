'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Play, ChevronRight, LogOut } from 'lucide-react'

const settingsOptions = [
  { label: 'Cambiar contraseña', href: '/settings/password' },
  { label: 'Administrar pago', href: '/settings/payment' },
  { label: 'Cambiar correo', href: '/settings/email' },
  { label: 'Canjear puntos', href: '/settings/redeem' },
  { label: 'Cancelar suscripción', href: '/settings/cancel' },
  { label: 'Eliminar cuenta', href: '/settings/delete' }
]

export default function SettingsPage() {
  const router = useRouter()

  const handleLogout = () => {
    // Clear auth data
    localStorage.clear()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Play className="h-8 w-8 text-primary fill-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              NextFlop
            </span>
          </Link>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Configurar cuenta</h1>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-0">
            {settingsOptions.map((option, index) => (
              <Link
                key={option.href}
                href={option.href}
                className={`flex items-center justify-between p-4 hover:bg-accent/5 transition-colors ${
                  index !== settingsOptions.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <span className="text-lg">{option.label}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
