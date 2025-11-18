'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export function PaymentWarning() {
  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-md border-destructive">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Suscripción vencida</CardTitle>
          <CardDescription className="text-base">
            Tu suscripción está vencida. Debes renovar tu pago para seguir viendo contenido.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild className="w-full bg-primary hover:bg-primary/90">
            <Link href="/settings/payment">Ir a administrar pagos</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
