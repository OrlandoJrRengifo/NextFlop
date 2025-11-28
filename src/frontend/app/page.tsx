import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Sparkles, Trophy, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
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
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/fondo.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
        
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">
            Disfruta películas y series{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ilimitadas
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty">
            Miles de títulos, calidad premium y beneficios exclusivos. Todo en una sola plataforma.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-lg px-8 h-14 shadow-lg shadow-primary/50 transition-all hover:shadow-xl hover:shadow-primary/50"
            asChild
          >
            <Link href="/register">
              Unirse ahora
            </Link>
          </Button>
        </div>
      </section>

      {/* Reasons Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-balance">
            Razones para unirte
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Card 1 */}
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Planes accesibles y flexibles</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed mb-4">
                  Elige el plan que mejor se adapte a ti. Desde básico hasta premium, todos con beneficios increíbles.
                </CardDescription>
                <Link 
                  href="/plans" 
                  className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 transition-colors"
                >
                  Ver planes <TrendingUp className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Sistema de puntos por suscripción</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed mb-4">
                  Gana puntos con cada renovación y canjéalos por meses gratis, descuentos y más beneficios.
                </CardDescription>
                <Link 
                  href="/points" 
                  className="text-secondary hover:text-secondary/80 font-medium inline-flex items-center gap-1 transition-colors"
                >
                  Ver información de puntos <TrendingUp className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Play className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-2xl">Catálogo en crecimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed mb-4">
                  Miles de películas y series nuevas cada mes. Desde clásicos hasta los últimos estrenos.
                </CardDescription>
                <Link 
                  href="#catalog" 
                  className="text-accent hover:text-accent/80 font-medium inline-flex items-center gap-1 transition-colors"
                >
                  Ver más <TrendingUp className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Marketing Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-balance">
                La mejor experiencia de streaming
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Con NextFlop, obtienes acceso a un catálogo en constante expansión con la mejor calidad de video y audio. 
                Disfruta en múltiples dispositivos, crea perfiles personalizados y recibe recomendaciones inteligentes.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Calidad hasta 4K Ultra HD</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>Audio envolvente Dolby Atmos</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>Sin anuncios ni interrupciones</span>
                </li>
              </ul>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden">
              <img
                src="/modern-streaming-interface-with-movies.jpg"
                alt="Interfaz de streaming"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur-sm border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Play className="h-6 w-6 text-primary fill-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  NextFlop
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">
                La plataforma de streaming que recompensa tu fidelidad.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Acerca de</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Carreras</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Prensa</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Soporte</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Centro de ayuda</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contacto</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Estado del servicio</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Términos de uso</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacidad</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 NextFlop. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
