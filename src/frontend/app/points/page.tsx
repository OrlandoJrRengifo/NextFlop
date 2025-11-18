import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Trophy, Gift, Star, Info } from 'lucide-react'

const earnPoints = [
  { action: 'Renovar suscripción Básica', points: 50, icon: Star },
  { action: 'Renovar suscripción Medium', points: 100, icon: Star },
  { action: 'Renovar suscripción Premium', points: 200, icon: Star },
  { action: 'Recomendar a un amigo', points: 150, icon: Gift },
  { action: 'Suscripción continua 6 meses', points: 300, icon: Trophy }
]

const redeemPoints = [
  {
    points: 300,
    reward: '1 mes gratis',
    description: 'Un mes completo de tu plan actual sin costo',
    terms: 'Válido para cualquier plan activo'
  },
  {
    points: 150,
    reward: '30% de descuento',
    description: 'Descuento del 30% en tu próxima renovación',
    terms: 'Aplicable solo a la siguiente factura'
  },
  {
    points: 500,
    reward: '2 meses gratis',
    description: 'Dos meses completos sin pagar',
    terms: 'Válido para planes Medium y Premium'
  },
  {
    points: 100,
    reward: 'Mejora temporal a Premium',
    description: '1 mes de upgrade a plan Premium',
    terms: 'Solo para usuarios de plan Básico o Medium'
  }
]

export default function PointsPage() {
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
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/register">Comenzar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-6 text-balance">
            Sistema de puntos NextFlop
          </h1>
          <p className="text-xl text-muted-foreground text-pretty">
            Recompensamos tu fidelidad. Gana puntos con cada renovación y canjéalos por beneficios exclusivos.
          </p>
        </div>

        {/* How to Earn Points */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Star className="h-8 w-8 text-secondary" />
              <h2 className="text-4xl font-bold">¿Cómo ganas puntos?</h2>
            </div>
            <Card className="bg-card/50 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardDescription className="text-base leading-relaxed">
                  Acumula puntos automáticamente cada vez que renovas tu suscripción. 
                  Mientras más tiempo permanezcas con nosotros, más beneficios obtendrás.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-semibold">Acción</th>
                        <th className="text-right p-4 font-semibold">Puntos otorgados</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnPoints.map((item, index) => (
                        <tr key={index} className="border-b border-border last:border-0">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                <item.icon className="h-5 w-5 text-secondary" />
                              </div>
                              <span>{item.action}</span>
                            </div>
                          </td>
                          <td className="text-right p-4">
                            <span className="font-bold text-lg text-secondary">+{item.points}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How to Redeem Points */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Gift className="h-8 w-8 text-accent" />
              <h2 className="text-4xl font-bold">¿Cómo redimir puntos?</h2>
            </div>
            <Card className="bg-card/50 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardDescription className="text-base leading-relaxed">
                  Canjea tus puntos acumulados por recompensas increíbles. Desde descuentos hasta meses gratis, 
                  tu fidelidad tiene grandes beneficios.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {redeemPoints.map((item, index) => (
                <Card 
                  key={index}
                  className="bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-2xl">{item.reward}</CardTitle>
                      <div className="bg-accent/10 px-3 py-1 rounded-full">
                        <span className="text-accent font-bold">{item.points} pts</span>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                      <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.terms}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Terms and Conditions */}
        <section>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Términos y condiciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Los puntos se acreditan automáticamente dentro de las 24 horas posteriores a la renovación.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Los puntos tienen una validez de 12 meses desde su obtención.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Si cancelas tu suscripción, perderás todos los puntos acumulados.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Las recompensas no son acumulables con otras promociones activas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>NextFlop se reserva el derecho de modificar el programa de puntos con previo aviso.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">¿Listo para empezar a ganar puntos?</h3>
          <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/register">
              Únete ahora
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
