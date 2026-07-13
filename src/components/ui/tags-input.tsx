"use client"

import * as React from "react"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const isControlled = controlled !== undefined
  const value = isControlled ? (controlled as T) : uncontrolled

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) {
        setUncontrolled(next)
      }
      onChange?.(next)
    },
    [isControlled, onChange]
  )

  return [value, setValue] as const
}

export interface TagsInputProps
  extends Omit<
    React.ComponentProps<"div">,
    "onChange" | "defaultValue" | "children"
  > {
  /** Controlled list of tags. */
  value?: string[]
  /** Initial tags when uncontrolled. */
  defaultValue?: string[]
  /** Called with the next tag list whenever it changes. */
  onValueChange?: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  /** Maximum number of tags. Further additions are ignored once reached. */
  max?: number
  /** Allow the same tag more than once. Defaults to false (deduped). */
  allowDuplicates?: boolean
  /** Split pasted text into multiple tags on the delimiters. Defaults to true. */
  addOnPaste?: boolean
  /** Characters that commit the current text as a tag (Enter always commits). */
  delimiters?: string[]
  /** Return false to reject a candidate tag (e.g. invalid email). */
  validate?: (tag: string) => boolean
  /** Emit hidden inputs so the tags post with a native form. */
  name?: string
  /** id applied to the text input, for pairing with a FieldLabel. */
  inputId?: string
  inputClassName?: string
  inputProps?: Omit<
    React.ComponentProps<"input">,
    "value" | "onChange" | "disabled" | "id" | "placeholder"
  >
  "aria-invalid"?: boolean | "true" | "false"
}

function TagsInput({
  value: valueProp,
  defaultValue = [],
  onValueChange,
  placeholder,
  disabled = false,
  max,
  allowDuplicates = false,
  addOnPaste = true,
  delimiters = [","],
  validate,
  name,
  inputId,
  className,
  inputClassName,
  inputProps,
  "aria-invalid": ariaInvalid,
  ...props
}: TagsInputProps) {
  const [tags, setTags] = useControllableState(
    valueProp,
    defaultValue,
    onValueChange
  )
  const [inputValue, setInputValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const commitChars = React.useMemo(
    () => new Set([...delimiters, "\n", "\r"]),
    [delimiters]
  )

  const splitRaw = React.useCallback(
    (raw: string) => {
      const result: string[] = []
      let buffer = ""
      for (const char of raw) {
        if (commitChars.has(char)) {
          if (buffer.trim()) result.push(buffer.trim())
          buffer = ""
        } else {
          buffer += char
        }
      }
      if (buffer.trim()) result.push(buffer.trim())
      return result
    },
    [commitChars]
  )

  const addTags = React.useCallback(
    (raw: string) => {
      const candidates = splitRaw(raw)
      if (candidates.length === 0) return

      const next = [...tags]
      for (const candidate of candidates) {
        if (max != null && next.length >= max) break
        if (!allowDuplicates && next.includes(candidate)) continue
        if (validate && !validate(candidate)) continue
        next.push(candidate)
      }

      if (next.length !== tags.length) {
        setTags(next)
      }
    },
    [allowDuplicates, max, setTags, splitRaw, tags, validate]
  )

  const removeAt = React.useCallback(
    (index: number) => {
      setTags(tags.filter((_, i) => i !== index))
    },
    [setTags, tags]
  )

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || delimiters.includes(event.key)) {
      if (inputValue.trim()) {
        event.preventDefault()
        addTags(inputValue)
        setInputValue("")
      } else if (event.key === "Enter") {
        // Let Enter submit a surrounding form when the buffer is empty.
        return
      }
    } else if (
      event.key === "Backspace" &&
      inputValue === "" &&
      tags.length > 0
    ) {
      event.preventDefault()
      removeAt(tags.length - 1)
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (!addOnPaste) return
    const text = event.clipboardData.getData("text")
    if (splitRaw(text).length > 1 || commitChars.has(text.at(-1) ?? "")) {
      event.preventDefault()
      addTags(text)
      setInputValue("")
    }
  }

  const atMax = max != null && tags.length >= max

  return (
    <div
      data-slot="tags-input"
      data-disabled={disabled || undefined}
      aria-invalid={ariaInvalid}
      className={cn(
        "flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-data-[slot=tags-input-item]:px-1 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      onMouseDown={(event) => {
        // Focus the input when clicking empty space, but let chip buttons work.
        if (event.target === event.currentTarget) {
          event.preventDefault()
          inputRef.current?.focus()
        }
      }}
      {...props}
    >
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          data-slot="tags-input-item"
          className="flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted pr-0 pl-1.5 text-xs font-medium whitespace-nowrap text-foreground"
        >
          {tag}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            disabled={disabled}
            aria-label={`Remove ${tag}`}
            data-slot="tags-input-item-remove"
            className="-ml-1 opacity-50 hover:opacity-100"
            onClick={() => removeAt(index)}
          >
            <XIcon className="pointer-events-none" />
          </Button>
        </span>
      ))}

      <input
        {...inputProps}
        ref={inputRef}
        id={inputId}
        type="text"
        disabled={disabled || atMax}
        value={inputValue}
        aria-invalid={ariaInvalid}
        placeholder={placeholder}
        className={cn(
          "min-w-16 flex-1 bg-transparent px-1 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
          inputClassName
        )}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={(event) => {
          if (inputValue.trim()) {
            addTags(inputValue)
            setInputValue("")
          }
          inputProps?.onBlur?.(event)
        }}
      />

      {name
        ? tags.map((tag, index) => (
            <input key={index} type="hidden" name={name} value={tag} />
          ))
        : null}
    </div>
  )
}

export { TagsInput }
