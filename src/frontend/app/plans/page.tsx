'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Play, Loader2, AlertCircle, Check } from 'lucide-react' // Usamos icono de User
import { apiFetch } from '@/services/api'

interface Plan {
  id: string;
  name: string;
  price: number;
  maxProfiles: number;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // Llamada al endpoint correcto
        const data = await apiFetch<Plan[]>('/plans');
        
        // Ordenar por precio ascendente
        data.sort((a, b) => a.price - b.price);

        setPlans(data);
      } catch (err: any) {
        console.error("Error cargando planes:", err);
        setError(err.message || 'Error al conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 p-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-xl font-semibold">No se pudieron cargar los planes</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Play className="h-8 w-8 text-primary fill-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              NextFlop
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild><Link href="/login">Iniciar sesión</Link></Button>
            <Button asChild className="bg-primary hover:bg-primary/90"><Link href="/register">Comenzar</Link></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-balance">Planes y precios</h1>
          <p className="text-xl text-muted-foreground text-pretty">
            Elige el plan que mejor se adapte a tus necesidades.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="relative bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary/50"
            >
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl mb-2">{plan.name}</CardTitle>
                <div className="text-5xl font-bold mb-2">
                  ${plan.price}
                </div>
                <CardDescription className="text-base">por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {/* Característica REAL 1: Perfiles */}
                  <li className="flex items-center gap-3">
                    <div className="bg-primary/10 p-1 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">
                      Hasta <strong>{plan.maxProfiles}</strong> {plan.maxProfiles === 1 ? 'perfil' : 'perfiles'}
                    </span>
                  </li>
                  
                  {/* Característica Genérica (siempre cierta para todos) */}
                  <li className="flex items-center gap-3">
                    <div className="bg-primary/10 p-1 rounded-full">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Acceso ilimitado a películas
                    </span>
                  </li>
                </ul>
                <Button 
                  className="w-full h-11 bg-primary hover:bg-primary/90"
                  asChild
                >
                  <Link href={`/register?plan=${plan.id}`}>
                    Seleccionar {plan.name}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}