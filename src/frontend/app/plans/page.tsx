'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlanCard } from '@/components/plan-card'

type PlanItem = {
  id: string
  name: string
  price: number
  features: string[]
}

export default function PlansPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<PlanItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    setIsLoading(true)
    fetch('http://localhost:3001/plans')
      .then((res) => res.json())
      .then((data) => {
        if (mounted) setPlans(data)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  const accentFor = (id: string) => {
    if (id === 'basic') return 'primary'
    if (id === 'medium') return 'secondary'
    return 'accent'
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-6 py-12 bg-background">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="text-3xl">Planes y precios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">Elige el plan que mejor se adapte a ti. Compara características y precios.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {isLoading && <p>Cargando planes...</p>}
            {!isLoading && plans.length === 0 && <p>No hay planes disponibles.</p>}
            {plans.map((p) => (
              <div key={p.id} className="flex flex-col">
                <PlanCard
                  name={p.name}
                  price={p.price}
                  features={p.features}
                  accentColor={accentFor(p.id) as any}
                  isSelected={false}
                  onSelect={() => {}}
                />
                <div className="mt-3">
                  <Button
                    className="w-full"
                    onClick={() => router.push(`/register?plan=${encodeURIComponent(p.id)}`)}
                  >
                    Elegir este plan
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Comparative table (simple) */}
          <div className="mt-8 overflow-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-4 py-2">Característica</th>
                  {plans.map((p) => (
                    <th key={p.id} className="px-4 py-2">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">Precio / mes</td>
                  {plans.map((p) => (
                    <td key={p.id} className="px-4 py-2">${p.price}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-2">Características</td>
                  {plans.map((p) => (
                    <td key={p.id} className="px-4 py-2">
                      <ul className="list-disc pl-5">
                        {p.features.slice(0, 5).map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

