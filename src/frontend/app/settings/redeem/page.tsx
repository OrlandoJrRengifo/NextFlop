'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, ArrowLeft, Trophy } from 'lucide-react'

const rewards = [
  { points: 180, reward: '15 dias gratis', available: true },
  { points: 300, reward: '1 mes gratis', available: true },
  { points: 500, reward: '2 meses gratis', available: false },
  { points: 700, reward: '3 meses gratis', available: true }
]

export default function RedeemPointsPage() {
  const router = useRouter()
  const [userPoints] = useState(50)

  const handleRedeem = (requiredPoints: number, reward: string) => {
    if (userPoints >= requiredPoints) {
      console.log('[v0] Redeeming:', reward)
      alert(`¡Has canjeado exitosamente: ${reward}!`)
    }
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

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <Trophy className="h-10 w-10 text-secondary" />
          <div>
            <h1 className="text-4xl font-bold">Canjear puntos</h1>
            <p className="text-xl text-secondary font-semibold">
              Puntos disponibles: {userPoints}
            </p>
          </div>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recompensas disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold">Puntos</th>
                    <th className="text-left p-3 font-semibold">Recompensa</th>
                    <th className="text-right p-3 font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {rewards.map((item, index) => {
                    const canRedeem = userPoints >= item.points
                    return (
                      <tr
                        key={index}
                        className={`border-b border-border last:border-0 ${
                          !canRedeem ? 'opacity-50' : ''
                        }`}
                      >
                        <td className="p-3">
                          <span className="font-bold text-secondary">{item.points}</span>
                        </td>
                        <td className="p-3">{item.reward}</td>
                        <td className="text-right p-3">
                          {canRedeem ? (
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90"
                              onClick={() => handleRedeem(item.points, item.reward)}
                            >
                              Canjear
                            </Button>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Puntos insuficientes
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Los puntos se acreditan automáticamente con cada renovación de suscripción.
            Consulta más información en nuestra{' '}
            <Link href="/points" className="text-primary hover:underline">
              página de puntos
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  )
}
