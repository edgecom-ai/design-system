// Stepper preview — multi-step flows; the card shows step states statically.
import { CheckIcon, LoaderCircleIcon, MapPinIcon, GaugeIcon, FileBarChartIcon } from "lucide-react"

import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"

export { default as InlineDescriptions } from "@/components/shadcn-studio/stepper/stepper-05"
export { default as HorizontalWithSubmit } from "@/components/shadcn-studio/stepper/stepper-08"
export { default as VerticalWithPanel } from "@/components/shadcn-studio/stepper/stepper-09"

const onboarding = [
  { id: "site", title: "Site", description: "Northridge Distribution Center" },
  { id: "meter", title: "Meter", description: "Map channels to commodities" },
  { id: "tariff", title: "Tariff", description: "Assign the utility rate" },
  { id: "review", title: "Review", description: "Confirm and go live" },
]

export function HorizontalStates() {
  return (
    <div className="w-full">
      <Stepper steps={onboarding} defaultValue="tariff" className="w-full">
        <StepperNav>
          {onboarding.map((step, index) => (
            <StepperItem key={step.id} stepId={step.id}>
              <StepperTrigger>
                <StepperIndicator>{index + 1}</StepperIndicator>
                <div className="flex flex-col items-start">
                  <StepperTitle>{step.title}</StepperTitle>
                  <StepperDescription className="text-nowrap">{step.description}</StepperDescription>
                </div>
              </StepperTrigger>
              {index < onboarding.length - 1 && <StepperSeparator />}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel className="mt-6 text-body-sm text-muted-foreground">
          {onboarding.map((step) => (
            <StepperContent key={step.id} value={step.id}>
              Step 3 of 4 — {step.description}
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  )
}

const iconSteps = [
  { id: "site", title: "Site", icon: <MapPinIcon /> },
  { id: "meter", title: "Meter", icon: <GaugeIcon /> },
  { id: "report", title: "Report", icon: <FileBarChartIcon /> },
]

export function OutlineIndicators() {
  return (
    <div className="w-full">
      <Stepper
        steps={iconSteps}
        defaultValue="meter"
        className="w-full"
        indicators={{ completed: <CheckIcon className="size-4" />, loading: <LoaderCircleIcon className="size-4 animate-spin" /> }}
      >
        <StepperNav>
          {iconSteps.map((step, index) => (
            <StepperItem key={step.id} stepId={step.id}>
              <StepperTrigger>
                <StepperIndicator variant="outline">{step.icon}</StepperIndicator>
                <StepperTitle>{step.title}</StepperTitle>
              </StepperTrigger>
              {index < iconSteps.length - 1 && <StepperSeparator />}
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>
    </div>
  )
}
