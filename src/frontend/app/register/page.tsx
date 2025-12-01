'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, ArrowLeft, Loader2 } from 'lucide-react'
import { RegistrationProgress } from '@/components/registration-progress'
import { PlanCard } from '@/components/plan-card'

// ------------------------
// 1. Configuración de Colores
// ------------------------
const COLOR_MAP: Record<string, "primary" | "secondary" | "accent"> = {
  'Básico': 'primary',
  'Standard': 'secondary',
  'Premium': 'accent'
};

// ------------------------
// 2. Funciones API
// ------------------------
async function completeOnboarding(body: any) {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
  const url = `${baseUrl}/api/onboarding/complete`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    throw new Error(error.message || "Error completing onboarding");
  }
  return resp.json();
}

async function fetchPlans() {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
  const url = `${baseUrl}/plans`; // URL correcta a Kong

  const resp = await fetch(url);
  if (!resp.ok) throw new Error("Error fetching subscription plans");
  return resp.json();
}

// ------------------------
// 3. Componente con la Lógica (Content)
// ------------------------
function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Datos del formulario
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')

  // Planes
  const [finalPlans, setFinalPlans] = useState<any[]>([]);

  useEffect(() => {
    const planFromUrl = searchParams.get('plan');
    if (planFromUrl) {
      setSelectedPlan(planFromUrl);
    }

    fetchPlans()
      .then((plans) => {
        const formattedPlans = plans.map((plan: any) => {
          const color = COLOR_MAP[plan.name] || 'primary';
          return {
            id: plan.id,
            name: plan.name,
            price: plan.price,
            accentColor: color,
            features: [
              `Hasta ${plan.maxProfiles} perfiles`,
              "Acceso ilimitado",
              "Cancela cuando quieras"
            ]
          };
        });
        formattedPlans.sort((a: any, b: any) => a.price - b.price);
        setFinalPlans(formattedPlans);
      })
      .catch(console.error);
  }, [searchParams]);

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
    // variable para el historial de pago
    const paymentRecord = {
      date: new Date().toLocaleDateString("es-CO"),
      method: `**** ${cardNumber.slice(-4)}`,
      discount: 0,
      amount: finalPlans.find(p => p.id === selectedPlan)?.price || 0
    };

    localStorage.setItem("nextflop_lastPayment", JSON.stringify(paymentRecord));

    const body = {
      user: { email, password, fullName, birthDate },
      planId: selectedPlan!,
      payment: { 
        cardNumber, 
        expiration: expiryDate, 
        cvv, 
        nameOnCard: cardName, 
        pointsToRedeem: 0 
      },
    };

    const response = await completeOnboarding(body);

    if (response.accessToken) {
      localStorage.setItem("nextflop_token", response.accessToken);
    }

    alert("¡Cuenta creada exitosamente!");
    router.push("/login");
  } catch (err: any) {
    console.error("Onboarding error:", err);
    alert(err.message || "Error al crear la cuenta");
  }

  setIsLoading(false);
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Play className="h-10 w-10 text-primary fill-primary" />
        <span className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          NextFlop
        </span>
      </Link>

      <RegistrationProgress currentStep={step} totalSteps={3} />

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
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Juan Pérez" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90">Siguiente</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Selecciona tu plan</h2>
            <p className="text-muted-foreground">Paso 2 de 3: Elige el plan perfecto para ti</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {finalPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                features={plan.features}
                accentColor={plan.accentColor}
                isSelected={selectedPlan === plan.id}
                onSelect={() => setSelectedPlan(plan.id)}
              />
            ))}
          </div>
          <div className="flex gap-4 max-w-lg mx-auto">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleStep2Submit} disabled={!selectedPlan}>
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="w-full max-w-4xl">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Información de pago</CardTitle>
              <CardDescription>Paso 3 de 3: Completa tu suscripción</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número de tarjeta</Label>
                    <Input id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required maxLength={19} placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiración</Label>
                      <Input id="expiryDate" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required maxLength={5} placeholder="MM/AA" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} required maxLength={4} placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nombre en tarjeta</Label>
                    <Input id="cardName" value={cardName} onChange={(e) => setCardName(e.target.value)} required placeholder="JUAN PEREZ" />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
                    </Button>
                    <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={isLoading}>
                      {isLoading ? 'Procesando...' : 'Finalizar y crear cuenta'}
                    </Button>
                  </div>
                </form>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Resumen</h3>
                    {selectedPlan && (
                      <Card className="bg-card border-border">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-semibold text-lg">Plan {finalPlans.find(p => p.id === selectedPlan)?.name}</p>
                              <p className="text-sm text-muted-foreground">Mensual</p>
                            </div>
                            <p className="text-2xl font-bold">${finalPlans.find(p => p.id === selectedPlan)?.price}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
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

// ------------------------
// 4. Componente Principal (Page)
// ------------------------
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}