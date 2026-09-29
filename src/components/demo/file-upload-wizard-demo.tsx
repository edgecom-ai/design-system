"use client"

import * as React from "react"
import { TriangleAlertIcon, UploadIcon } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"
import { FileDropZone } from "@/components/demo/file-drop-zone"

const steps = [
  { id: "file", title: "File" },
  { id: "mapping", title: "Mapping" },
  { id: "review", title: "Review" },
]

type StepId = "file" | "mapping" | "review"

// How many of each list's contacts the sample already overlaps with.
const lists = [
  { value: "newsletter", label: "Newsletter", existing: 12 },
  { value: "customers", label: "Customers", existing: 31 },
  { value: "events", label: "Event guests", existing: 0 },
]

type Parsed = { headers: string[]; rows: string[][] }

const firstNames = ["Ana", "Ben", "Chloe", "Dev", "Ella", "Finn", "Grace", "Hugo", "Iris", "Jon"]
const lastNames = ["Reyes", "Park", "Novak", "Shah", "Moreau", "Kim", "Lund", "Costa"]

// A sheet of made-up contacts, so the wizard can be walked without a file.
function sampleCsv() {
  const lines = ["Email,Full name,Company"]
  for (let i = 0; i < 240; i++) {
    const first = firstNames[i % firstNames.length]
    const last = lastNames[(i * 7) % lastNames.length]
    lines.push(`${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com,${first} ${last},Studio ${(i % 9) + 1}`)
  }
  return new File([lines.join("\n")], "contacts.csv", { type: "text/csv" })
}

function parseCsv(text: string): Parsed {
  const [header = "", ...body] = text.split(/\r?\n/).filter((line) => line.trim() !== "")
  return { headers: header.split(",").map((cell) => cell.trim()), rows: body.map((line) => line.split(",")) }
}

function ColumnSelect({
  id,
  label,
  columns,
  value,
  error,
  onChange,
}: {
  id: string
  label: string
  columns: string[]
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  const items = columns.map((column) => ({ label: column, value: column }))
  return (
    <Field className="w-max max-w-full min-w-40" data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select items={items} value={value} onValueChange={(next) => onChange(next ?? "")}>
        <SelectTrigger id={id} aria-invalid={error ? true : undefined}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

export function FileUploadWizardDemo() {
  const [step, setStep] = React.useState<StepId>("file")
  const [file, setFile] = React.useState<File>()
  const [csv, setCsv] = React.useState<Parsed>()
  const [emailColumn, setEmailColumn] = React.useState("")
  const [nameColumn, setNameColumn] = React.useState("")
  const [list, setList] = React.useState("")
  const [touched, setTouched] = React.useState(false)

  const stepIndex = steps.findIndex((item) => item.id === step)
  const fileProblem =
    csv && (csv.headers.length < 2 || csv.rows.length === 0)
      ? "That file has no rows. A CSV needs a header row and at least one line of data."
      : undefined
  const sameColumn = emailColumn !== "" && emailColumn === nameColumn
  const chosenList = lists.find((item) => item.value === list)

  async function selectFile(next: File) {
    setFile(next)
    const parsed = parseCsv(await next.text())
    setCsv(parsed)
    setEmailColumn(parsed.headers[0] ?? "")
    setNameColumn(parsed.headers[1] ?? "")
  }

  function clearFile() {
    setFile(undefined)
    setCsv(undefined)
  }

  function reset() {
    clearFile()
    setList("")
    setTouched(false)
    setStep("file")
  }

  const satisfied =
    step === "file" ? file !== undefined && !fileProblem : step === "mapping" ? !sameColumn && !!list : true

  function next() {
    if (!satisfied) {
      setTouched(true)
      return
    }
    setTouched(false)
    if (step === "review") {
      toast.success("Contacts imported", {
        description: `${(csv?.rows.length ?? 0).toLocaleString("en-US")} contacts were added to ${chosenList?.label}.`,
      })
      reset()
      return
    }
    setStep(steps[stepIndex + 1].id as StepId)
  }

  const rows = csv?.rows.length ?? 0
  const existing = Math.min(chosenList?.existing ?? 0, rows)

  const summary = [
    { label: "File", value: file?.name ?? "—" },
    { label: "Rows", value: `${rows.toLocaleString("en-US")} contacts` },
    { label: "Columns", value: `${emailColumn} → email, ${nameColumn} → name` },
    { label: "List", value: chosenList?.label ?? "—" },
    { label: "New to the list", value: (rows - existing).toLocaleString("en-US") },
    { label: "Already on the list", value: existing.toLocaleString("en-US") },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import contacts</CardTitle>
        <CardDescription className="max-w-3xl">
          Add people to a mailing list from a spreadsheet. Match its columns, pick the list, and review before
          anything is added.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Stepper
          steps={steps}
          responsive
          value={step}
          onValueChange={(value) => setStep(value as StepId)}
          className="flex flex-col gap-6"
        >
          <StepperNav aria-label="Import steps">
            {steps.map((item, index) => (
              <StepperItem key={item.id} stepId={item.id} disabled={index > stepIndex} className="relative flex-1">
                <StepperTrigger className="flex-col gap-2.5">
                  <StepperIndicator>{index + 1}</StepperIndicator>
                  <StepperTitle>{item.title}</StepperTitle>
                </StepperTrigger>
                {index < steps.length - 1 && (
                  <StepperSeparator className="absolute top-2 right-[calc(-50%+--spacing(4))] left-[calc(50%+--spacing(4))]" />
                )}
              </StepperItem>
            ))}
          </StepperNav>
          <StepperPanel>
            <StepperContent value="file">
              <div className="flex flex-col gap-3">
                <FileDropZone
                  accept=".csv,text/csv"
                  title="Drop a CSV file here"
                  description="One file at a time, up to 10 MB"
                  file={file}
                  error={fileProblem ?? (touched && !file ? "Choose a file to continue." : undefined)}
                  onSelect={(picked) => void selectFile(picked)}
                  onClear={clearFile}
                />
                {!file && (
                  <Button variant="link" className="self-center" onClick={() => void selectFile(sampleCsv())}>
                    Use a sample file
                  </Button>
                )}
              </div>
            </StepperContent>
            <StepperContent value="mapping">
              <FieldGroup>
                <FieldSet>
                  <FieldLegend variant="label">Match your columns</FieldLegend>
                  <FieldDescription className="max-w-3xl">
                    Only these two columns are imported. Anything else in the file is ignored.
                  </FieldDescription>
                  <div className="flex flex-wrap items-start gap-3">
                    <ColumnSelect
                      id="import-email-column"
                      label="Email column"
                      columns={csv?.headers ?? []}
                      value={emailColumn}
                      onChange={setEmailColumn}
                    />
                    <ColumnSelect
                      id="import-name-column"
                      label="Name column"
                      columns={csv?.headers ?? []}
                      value={nameColumn}
                      error={sameColumn ? "Pick a different column from the email." : undefined}
                      onChange={setNameColumn}
                    />
                  </div>
                </FieldSet>
                <FieldSeparator />
                <FieldSet>
                  <FieldLegend variant="label">Choose a list</FieldLegend>
                  <FieldDescription className="max-w-3xl">
                    Contacts already on the list keep their subscription and get the new name.
                  </FieldDescription>
                  <Field className="w-80 max-w-full" data-invalid={touched && !list ? true : undefined}>
                    <FieldLabel htmlFor="import-list">List</FieldLabel>
                    <Select items={lists} value={list || null} onValueChange={(next) => setList(next ?? "")}>
                      <SelectTrigger id="import-list" className="w-full" aria-invalid={touched && !list ? true : undefined}>
                        <SelectValue placeholder="Pick a list" />
                      </SelectTrigger>
                      <SelectContent>
                        {lists.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {touched && !list && <FieldError>Pick a list.</FieldError>}
                  </Field>
                </FieldSet>
              </FieldGroup>
            </StepperContent>
            <StepperContent value="review">
              <div className="flex flex-col gap-4">
                <dl className="flex flex-col overflow-hidden rounded-lg border">
                  {summary.map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-2.5 not-first:border-t"
                    >
                      <dt className="w-48 shrink-0 text-body text-muted-foreground">{row.label}</dt>
                      <dd className="min-w-0 flex-1 text-body font-medium tabular-nums">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                {existing > 0 && (
                  <Alert variant="warning">
                    <TriangleAlertIcon />
                    <AlertDescription>
                      {existing} of these contacts are already on {chosenList?.label}. Importing replaces their
                      names with the ones in this file.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </StepperContent>
          </StepperPanel>
        </Stepper>
        <div className="flex justify-end gap-2">
          {stepIndex > 0 && (
            <Button variant="outline" onClick={() => setStep(steps[stepIndex - 1].id as StepId)}>
              Back
            </Button>
          )}
          <Button onClick={next}>
            {step === "review" ? (
              <>
                <UploadIcon data-icon="inline-start" />
                Import
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
