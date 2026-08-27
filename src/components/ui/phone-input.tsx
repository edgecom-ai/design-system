'use client'

import type { ComponentProps } from "react"
import { createContext, useContext, useMemo, useState } from "react"

import * as BasePhoneInput from "react-phone-number-input"
import flags from "react-phone-number-input/flags"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue
} from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { EarthIcon } from "lucide-react"

type PhoneInputSize = 'sm' | 'default' | 'lg'

const PhoneInputContext = createContext<{
  variant: PhoneInputSize
  popupClassName?: string
  scrollAreaClassName?: string
  inputClassName?: string
  triggerClassName?: string
  readOnly?: boolean
}>({
  variant: 'default',
  popupClassName: undefined,
  scrollAreaClassName: undefined,
  inputClassName: undefined,
  triggerClassName: undefined,
  readOnly: false
})

type PhoneInputProps = Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'ref'> &
  Omit<
    BasePhoneInput.Props<typeof BasePhoneInput.default>,
    'onChange' | 'variant' | 'popupClassName' | 'scrollAreaClassName'
  > & {
    onChange?: (value: BasePhoneInput.Value) => void
    variant?: PhoneInputSize
    popupClassName?: string
    scrollAreaClassName?: string
    inputClassName?: string
    triggerClassName?: string
    extensionClassName?: string
    /**
     * A desk extension, kept as its own value: E.164 — what `onChange` emits —
     * cannot carry one, so packing it into the phone string would lose it on the
     * next round-trip. The field renders as soon as either of these is passed.
     */
    extension?: string
    onExtensionChange?: (extension: string) => void
    extensionPlaceholder?: string
    extensionLabel?: string
    maxExtensionLength?: number
  }

const PhoneInput = ({
  className,
  variant,
  popupClassName,
  scrollAreaClassName,
  inputClassName,
  triggerClassName,
  extensionClassName,
  extension,
  onExtensionChange,
  extensionPlaceholder = 'Ext.',
  extensionLabel = 'Phone extension',
  maxExtensionLength = 8,
  onChange,
  value,
  ...props
}: PhoneInputProps) => {
  const phoneInputSize = variant || 'default'
  const hasExtension = extension !== undefined || onExtensionChange !== undefined

  // `smartCaret` is deliberately left to the library's `true` default: it keeps
  // the caret next to the digit you are editing when a correction mid-number
  // reflows the format. A consumer hitting the old Samsung caret bug can still
  // pass `smartCaret={false}` — `{...props}` below carries it through.
  const phoneField = (
    <BasePhoneInput.default
      className={cn(
        'flex',
        hasExtension && 'min-w-0 flex-1',
        props['aria-invalid'] &&
          '[&_*[data-slot=combobox-trigger]]:border-destructive [&_*[data-slot=combobox-trigger]]:ring-destructive/50',
        !hasExtension && className
      )}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      value={value || undefined}
      onChange={value => onChange?.(value || ('' as BasePhoneInput.Value))}
      {...props}
    />
  )

  // `className` always lands on the component's root element — the wrapper when
  // there is an extension, the phone field itself when there isn't — so a
  // consumer's `hidden` or `w-64` governs the whole control either way.
  return (
    <PhoneInputContext.Provider
      value={{
        variant: phoneInputSize,
        popupClassName,
        scrollAreaClassName,
        inputClassName,
        triggerClassName,
        readOnly: props.readOnly
      }}
    >
      {hasExtension ? (
        <div data-slot='phone-input-group' className={cn('flex items-stretch', className)}>
          {phoneField}
          <Input
            data-slot='phone-input-extension'
            className={cn('ml-2 h-auto w-24 shrink-0', extensionClassName)}
            inputMode='numeric'
            autoComplete='tel-extension'
            placeholder={extensionPlaceholder}
            aria-label={extensionLabel}
            // The pair reads as one control, so it goes destructive as one.
            aria-invalid={props['aria-invalid']}
            value={extension ?? ''}
            disabled={props.disabled}
            readOnly={props.readOnly}
            onChange={event =>
              onExtensionChange?.(event.target.value.replace(/\D/g, '').slice(0, maxExtensionLength))
            }
          />
        </div>
      ) : (
        phoneField
      )}
    </PhoneInputContext.Provider>
  )
}

const InputComponent = ({ className, ...props }: ComponentProps<typeof Input>) => {
  const { variant, inputClassName } = useContext(PhoneInputContext)

  return (
    <Input
      className={cn(
        'rounded-l-none focus:z-1',
        variant === 'sm' && 'h-auto! py-0!',
        variant === 'lg' && 'h-auto!',
        inputClassName,
        className
      )}
      {...props}
    />
  )
}

type CountryEntry = { label: string; value: BasePhoneInput.Country | undefined }

type CountrySelectProps = {
  disabled?: boolean
  value: BasePhoneInput.Country
  options: CountryEntry[]
  onChange: (country: BasePhoneInput.Country) => void
}

const CountrySelect = ({ disabled, value: selectedCountry, options: countryList, onChange }: CountrySelectProps) => {
  const { variant, popupClassName, triggerClassName, readOnly } = useContext(PhoneInputContext)
  const [searchValue, setSearchValue] = useState('')

  const filteredCountries = useMemo(() => {
    if (!searchValue) return countryList

    return countryList.filter(({ label }) => label.toLowerCase().includes(searchValue.toLowerCase()))
  }, [countryList, searchValue])

  return (
    <Combobox
      items={filteredCountries}
      value={selectedCountry || ''}
      onValueChange={(country: BasePhoneInput.Country | null) => {
        if (country) {
          onChange(country)
        }
      }}
    >
      <ComboboxTrigger
        render={
          <Button
            variant='outline'
            size={variant}
            className={cn(
              'flex gap-1 rounded-r-none border-e-0 px-2.5 py-0 leading-none hover:bg-transparent focus:z-10 aria-pressed:bg-transparent',
              disabled && 'dark:disabled:bg-input/80',
              triggerClassName
            )}
            disabled={disabled || readOnly}
          >
            <span className='sr-only'>
              <ComboboxValue />
            </span>
            <FlagComponent country={selectedCountry} countryName={selectedCountry} />
          </Button>
        }
      />
      <ComboboxContent className={cn('w-xs *:data-[slot=input-group]:bg-transparent', popupClassName)}>
        <ComboboxInput
          placeholder='e.g. United States'
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          showTrigger={false}
          className='border-input focus-visible:border-border rounded-none border-0 px-0 py-2.5 shadow-none ring-0! outline-none! focus-visible:ring-0 focus-visible:ring-offset-0'
        />
        <ComboboxSeparator />
        <ComboboxEmpty className='px-4 py-2.5 text-body-sm'>No country found.</ComboboxEmpty>
        <ComboboxList>
          <div className='relative flex max-h-full'>
            <div className='flex max-h-[min(var(--available-height),24rem)] w-full scroll-pt-2 scroll-pb-2 flex-col overscroll-contain'>
              <ScrollArea className='size-full min-h-0 **:data-[slot=scroll-area-scrollbar]:m-0 [&_[data-slot=scroll-area-viewport]]:h-full [&_[data-slot=scroll-area-viewport]]:overscroll-contain'>
                {filteredCountries.map((item: CountryEntry) =>
                  item.value ? (
                    <ComboboxItem key={item.value} value={item.value} className='flex items-center gap-2'>
                      <FlagComponent country={item.value} countryName={item.label} />
                      <span className='flex-1 text-body-sm'>{item.label}</span>
                      <span className='text-foreground/50 text-body-sm'>
                        {`+${BasePhoneInput.getCountryCallingCode(item.value)}`}
                      </span>
                    </ComboboxItem>
                  ) : null
                )}
              </ScrollArea>
            </div>
          </div>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

const FlagComponent = ({ country, countryName }: BasePhoneInput.FlagProps) => {
  const Flag = flags[country]

  return (
    <span className="flex h-4 w-4 items-center justify-center [&_svg:not([class*='size-'])]:size-full! [&_svg:not([class*='size-'])]:rounded-[5px]">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <EarthIcon className='size-4 opacity-60' />
      )}
    </span>
  )
}

export { PhoneInput }
