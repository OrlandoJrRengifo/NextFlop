'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Play, ArrowLeft, CreditCard, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const paymentHistory = [
  { date: '01/02/2025', amount: 14.99, method: '**** 4242', discount: 0 },
  { date: '01/01/2025', amount: 14.99, method: '**** 4242', discount: 0 },
  { date: '01/12/2024', amount: 10.49, method: '**** 4242', discount: 4.50 }
]

export default function PaymentPage() {
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

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <h1 className="text-4xl font-bold mb-8">Administrar pago</h1>

        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Renovar suscripción
              </CardTitle>
              <CardDescription>Mantén tu acceso activo renovando tu plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Último pago</p>
                  <p className="font-semibold">01/02/2025</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Fecha de vencimiento</p>
                  <p className="font-semibold">01/03/2025</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Mes pendiente</p>
                  <p className="font-semibold text-primary">Marzo 2025</p>
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Plan actual: Medium</AlertTitle>
                <AlertDescription>
                  Tu próximo pago será de $14.99 USD
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  Renovar con tarjeta guardada
                </Button>
                <Button variant="outline" className="flex-1">
                  Usar nuevo método de pago
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Payment Method */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Método de pago actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tarjeta terminada en 4242</p>
                  <p className="text-sm text-muted-foreground">Vence 12/26</p>
                </div>
                <Button variant="outline">Cambiar método</Button>
              </div>
            </CardContent>
          </Card>

          {/* Latest Receipt */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Último recibo</CardTitle>
              <CardDescription>Cobro del 01/02/2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio base (Medium)</span>
                  <span>$14.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Descuento aplicado</span>
                  <span className="text-green-500">-$0.00</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold text-lg">
                  <span>Total cobrado</span>
                  <span>$14.99</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Historial de pagos</CardTitle>
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
                    {paymentHistory.map((payment, index) => (
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
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
