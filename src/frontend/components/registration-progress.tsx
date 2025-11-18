interface RegistrationProgressProps {
  currentStep: number
  totalSteps: number
}

export function RegistrationProgress({ currentStep, totalSteps }: RegistrationProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              index + 1 === currentStep
                ? 'bg-primary text-primary-foreground scale-110'
                : index + 1 < currentStep
                ? 'bg-primary/50 text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`w-12 h-1 mx-1 transition-all ${
                index + 1 < currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
