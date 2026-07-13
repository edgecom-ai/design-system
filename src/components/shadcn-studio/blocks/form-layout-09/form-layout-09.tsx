'use client'

import { Fragment, useState } from 'react'

import * as Stepperize from '@stepperize/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

import AccountSetupStep from '@/components/shadcn-studio/blocks/form-layout-09/account-setup-step'
import CompanyDetailsStep from '@/components/shadcn-studio/blocks/form-layout-09/company-details-step'
import SubscriptionStep from '@/components/shadcn-studio/blocks/form-layout-09/subscription-step'
import WelcomeStep from '@/components/shadcn-studio/blocks/form-layout-09/welcome-step'
import { ChevronRightIcon } from "lucide-react"

const { useStepper } = Stepperize.defineStepper([
  {
    id: 'multi-step-1-account-details',
    title: 'Account Setup',
    description: 'Create your account'
  },
  {
    id: 'multi-step-1-personal-info',
    title: 'Company Details',
    description: 'Business information'
  },
  {
    id: 'multi-step-1-billing',
    title: 'Subscription',
    description: 'Choose your plan'
  },
  { id: 'multi-step-1-complete', title: 'Complete', description: 'All set!' }
])

export type StepperType = ReturnType<typeof useStepper>

export type AccountSetupValues = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  timezone: string
}

export type CompanyDetailsValues = {
  companyName: string
  industry: string
  companySize: string
  website: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export type SubscriptionValues = {
  plan: string
  cardNumber: string
  cardholderName: string
  expiryDate: string
  cvc: string
}

export type FormData = {
  accountSetup: AccountSetupValues
  companyDetails: CompanyDetailsValues
  subscription: SubscriptionValues
}

const defaultFormData: FormData = {
  accountSetup: {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    timezone: ''
  },
  companyDetails: {
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  },
  subscription: {
    plan: 'professional',
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvc: ''
  }
}

const MultiStepForm = () => {
  const stepper = useStepper()
  const currentStep = stepper.index
  const [formData, setFormData] = useState<FormData>(defaultFormData)

  const saveAccountSetup = (data: AccountSetupValues) => setFormData(prev => ({ ...prev, accountSetup: data }))

  const saveCompanyDetails = (data: CompanyDetailsValues) => setFormData(prev => ({ ...prev, companyDetails: data }))

  const saveSubscription = (data: SubscriptionValues) => setFormData(prev => ({ ...prev, subscription: data }))

  const resetFormData = () => setFormData(defaultFormData)

  return (
    <div className='flex w-full flex-col gap-12'>
      <nav aria-label='Multi Steps'>
        <ol className='flex items-center justify-between gap-x-2 gap-y-4 max-md:flex-col max-md:items-start'>
          {stepper.steps
            .filter(step => step.id !== 'multi-step-1-complete')
            .map((step, index, array) => (
              <Fragment key={step.id}>
                <li>
                  <Button
                    variant='ghost'
                    className='h-auto shrink-0 cursor-default gap-2 rounded bg-transparent! p-0 px-0!'
                  >
                    <Avatar className='size-10.5'>
                      <AvatarFallback
                        className={cn({
                          'bg-primary text-primary-foreground shadow-sm': index <= currentStep
                        })}
                      >
                        <span className='text-base font-semibold'>{index + 1}</span>
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col items-start'>
                      <span className='text-base'>{step.title}</span>
                      <span className='text-muted-foreground text-sm'>{step.description}</span>
                    </div>
                  </Button>
                </li>
                {index < array.length - 1 && (
                  <li className='max-md:hidden'>
                    <ChevronRightIcon className='size-4' />
                  </li>
                )}
              </Fragment>
            ))}
        </ol>
      </nav>
      <div className='flex flex-col gap-6'>
        {stepper.match({
          'multi-step-1-account-details': () => (
            <AccountSetupStep stepper={stepper} defaultValues={formData.accountSetup} onSave={saveAccountSetup} />
          ),
          'multi-step-1-personal-info': () => (
            <CompanyDetailsStep stepper={stepper} defaultValues={formData.companyDetails} onSave={saveCompanyDetails} />
          ),
          'multi-step-1-billing': () => (
            <SubscriptionStep stepper={stepper} defaultValues={formData.subscription} onSave={saveSubscription} />
          ),
          'multi-step-1-complete': () => <WelcomeStep stepper={stepper} onReset={resetFormData} />
        })}
      </div>
    </div>
  )
}

export default MultiStepForm
