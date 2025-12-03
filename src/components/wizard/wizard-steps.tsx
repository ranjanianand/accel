import { Check } from 'lucide-react'
import { clsx } from 'clsx'

export interface Step {
  number: number
  title: string
  description: string
}

export interface WizardStepsProps {
  steps: Step[]
  currentStep: number
}

export function WizardSteps({ steps, currentStep }: WizardStepsProps) {
  return (
    <div className="flex items-center justify-center gap-8 py-8 border-b border-border">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number
        const isCurrent = currentStep === step.number
        const isUpcoming = currentStep < step.number

        return (
          <div key={step.number} className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                  {
                    'border-foreground bg-foreground text-background': isCompleted,
                    'border-foreground bg-background text-foreground': isCurrent,
                    'border-border bg-background text-foreground-tertiary': isUpcoming,
                  }
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              <div>
                <div
                  className={clsx('text-sm font-medium', {
                    'text-foreground': isCurrent || isCompleted,
                    'text-foreground-tertiary': isUpcoming,
                  })}
                >
                  {step.title}
                </div>
                <div className="text-xs text-foreground-secondary">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={clsx('h-px w-12 transition-colors', {
                  'bg-foreground': isCompleted,
                  'bg-border': !isCompleted,
                })}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
