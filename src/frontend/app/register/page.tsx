"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, ArrowLeft } from 'lucide-react'
import { RegistrationProgress } from '@/components/registration-progress'
import { PlanCard } from '@/components/plan-card'

type Plan = string | null

type PlanItem = {
  id: string
  name: string
  price: number
  features: string[]
}

const accentFor = (id: string) => {
  if (id === 'basic') return 'primary'
  if (id === 'medium') return 'secondary'
  return 'accent'
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Step 1 data
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Step 2 data
  const [selectedPlan, setSelectedPlan] = useState<Plan>(null)

  // Plans fetched from backend
  const [plans, setPlans] = useState<PlanItem[]>([])
  const [loadingPlans, setLoadingPlans] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoadingPlans(true)
    fetch('http://localhost:3001/plans')
      .then((res) => res.json())
      .then((data) => {
        if (mounted) setPlans(data)
      })
      .catch(() => {})
      .finally(() => setLoadingPlans(false))

    return () => {
      mounted = false
    }
  }, [])

  // Check query param to preselect plan (read from window to avoid SSR hook during prerender)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const planFromQuery = params.get('plan')
    if (planFromQuery) setSelectedPlan(planFromQuery as Plan)
  }, [])

  // Step 3 data
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    setStep(2)
  }

  const handleStep2Submit = () => {
    if (!selectedPlan) {
      alert('Por favor selecciona un plan')
      return
    }
    setStep(3)
  }

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Primero, crear payment mock y obtener last4
      const payRes = await fetch('http://localhost:3001/payments/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardNumber, expiryDate, cvv, cardName }),
      });
      if (!payRes.ok) {
        const err = await payRes.json();
        alert(err.message || 'Error al procesar pago');
        setIsLoading(false);
        return;
      }
      const payData = await payRes.json();

      const payload = {
        email,
        password,
        fullName,
        birthDate,
        plan: selectedPlan,
        paymentLast4: payData.last4,
      };

      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json();
        alert(error.message || 'Error al registrar usuario');
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      // Después del registro, si no hay perfil activo, dirigir al selector de perfiles
      const activeProfile = localStorage.getItem('activeProfile');
      if (!activeProfile) {
        alert('¡Cuenta creada! Por favor crea tu perfil.');
        router.push('/profiles');
      } else {
        alert('¡Cuenta creada exitosamente! Serás redirigido al dashboard.');
        router.push('/dashboard');
      }
    } catch (err) {
      alert('Error de red o servidor');
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      {/* Logo Header */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Play className="h-10 w-10 text-primary fill-primary" />
        <span className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          NextFlop
        </span>
      </Link>

      {/* Progress Indicator */}
      <RegistrationProgress currentStep={step} totalSteps={3} />

      {/* Step 1: User Data */}
      {step === 1 && (
        <Card className="w-full max-w-lg bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Crear cuenta</CardTitle>
            <CardDescription>Paso 1 de 3: Datos del usuario</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90"
              >
                Siguiente
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Plan Selection */}
      {step === 2 && (
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Selecciona tu plan</h2>
            <p className="text-muted-foreground">Paso 2 de 3: Elige el plan perfecto para ti</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                features={plan.features}
                accentColor={accentFor(plan.id) as any}
                isSelected={selectedPlan === plan.id}
                onSelect={() => setSelectedPlan(plan.id)}
              />
            ))}
          </div>

          <div className="flex gap-4 max-w-lg mx-auto">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Atrás
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleStep2Submit}
              disabled={!selectedPlan}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="w-full max-w-4xl">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Información de pago</CardTitle>
              <CardDescription>Paso 3 de 3: Completa tu suscripción</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Payment Form */}
                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número de tarjeta</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Fecha de expiración</Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/AA"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                        maxLength={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="JUAN PEREZ"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Al continuar aceptas nuestras{' '}
                      <Link href="#" className="text-primary hover:underline">
                        Condiciones de Uso
                      </Link>
                      {' '}y{' '}
                      <Link href="#" className="text-primary hover:underline">
                        Política de Privacidad
                      </Link>
                      . Tu suscripción se renovará automáticamente.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep(2)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Atrás
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Procesando...' : 'Finalizar y crear cuenta'}
                    </Button>
                  </div>
                </form>

                {/* Plan Summary */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Resumen de tu plan</h3>
                    {selectedPlan && (
                      <Card className="bg-card border-border">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-semibold text-lg">
                                Plan {plans.find(p => p.id === selectedPlan)?.name}
                              </p>
                              <p className="text-sm text-muted-foreground">Suscripción mensual</p>
                            </div>
                            <p className="text-2xl font-bold">
                              ${plans.find(p => p.id === selectedPlan)?.price}
                            </p>
                          </div>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-primary"
                            onClick={() => setStep(2)}
                          >
                            Cambiar plan
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold text-primary">Beneficio especial:</span>{' '}
                      Comenzarás a acumular puntos desde tu primera renovación mensual. 
                      ¡Canjéalos por meses gratis y descuentos exclusivos!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
