import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

interface PlanCardProps {
  name: string
  price: number
  features: string[]
  isSelected: boolean
  onSelect: () => void
  accentColor?: 'primary' | 'secondary' | 'accent'
}

export function PlanCard({ 
  name, 
  price, 
  features, 
  isSelected, 
  onSelect,
  accentColor = 'primary'
}: PlanCardProps) {
  const colorClasses = {
    primary: 'border-primary shadow-primary/20',
    secondary: 'border-secondary shadow-secondary/20',
    accent: 'border-accent shadow-accent/20'
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
        isSelected 
          ? `${colorClasses[accentColor]} shadow-lg border-2` 
          : 'bg-card/50 backdrop-blur-sm hover:border-primary/30'
      }`}
      onClick={onSelect}
    >
      <CardHeader>
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription className="text-3xl font-bold text-foreground">
          ${price}
          <span className="text-sm font-normal text-muted-foreground">/mes</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 text-${accentColor}`} />
              <span className="text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
        {isSelected && (
          <div className={`mt-4 p-2 rounded-lg bg-${accentColor}/10 text-center`}>
            <span className={`text-sm font-medium text-${accentColor}`}>Plan seleccionado</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
