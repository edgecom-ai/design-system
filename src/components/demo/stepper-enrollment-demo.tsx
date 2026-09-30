"use client"

import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"

// Enrolling a site in a demand-response program. `responsive` lays the steps
// out in a row from md up and stacks them below it.
const steps = [
  { id: "program", title: "Program", description: "Choose a DR program" },
  { id: "baseline", title: "Baseline", description: "Review the load baseline" },
  { id: "commitment", title: "Commitment", description: "Set the kW reduction" },
  { id: "confirm", title: "Confirm", description: "Sign and enroll" },
]

export function StepperEnrollmentDemo() {
  return (
    <div className="w-full max-w-3xl">
      <Stepper steps={steps} defaultValue="commitment" responsive>
        <StepperNav>
          {steps.map((step, index) => (
            <StepperItem key={step.id} stepId={step.id}>
              <StepperTrigger>
                <StepperIndicator>{index + 1}</StepperIndicator>
                <div className="flex flex-col items-start text-start">
                  <StepperTitle>{step.title}</StepperTitle>
                  <StepperDescription>{step.description}</StepperDescription>
                </div>
              </StepperTrigger>
              {index < steps.length - 1 && <StepperSeparator />}
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>
    </div>
  )
}
