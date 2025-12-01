'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, ArrowLeft } from 'lucide-react'

export default function PaymentPage() {
  const router = useRouter()

  const [paymentHistory, setPaymentHistory] = useState<any[]>([])

  useEffect(() => {
    const lastPayment = localStorage.getItem("nextflop_lastPayment")

    if (lastPayment) {
      setPaymentHistory([JSON.parse(lastPayment)])
    } else {
      // si no hay nada, ponemos un array vacío (evita que no renderice)
      setPaymentHistory([])
    }
  }, [])

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

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <h1 className="text-4xl font-bold mb-8">Historial de pagos</h1>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Pagos registrados</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold">Fecha</th>
                    <th className="text-left p-3 font-semibold">Método</th>
                    <th className="text-right p-3 font-semibold">Descuento</th>
                    <th className="text-right p-3 font-semibold">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {paymentHistory.length > 0 ? (
                    paymentHistory.map((payment, index) => (
                      <tr key={index} className="border-b border-border last:border-0">
                        <td className="p-3">{payment.date}</td>
                        <td className="p-3">{payment.method}</td>
                        <td className="text-right p-3 text-green-500">
                          {payment.discount > 0 ? `-$${payment.discount.toFixed(2)}` : '-'}
                        </td>
                        <td className="text-right p-3 font-semibold">
                          ${payment.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center p-4 text-muted-foreground">
                        No hay pagos registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
