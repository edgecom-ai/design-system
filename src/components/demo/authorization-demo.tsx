import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

const steps = [
  { label: "Verifying authorization code", status: "done" },
  { label: "Fetching utility account access", status: "done" },
  { label: "Syncing meters and accounts", status: "active" },
] as const

export function AuthorizationDemo() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6">
      <Logo className="h-6 w-auto" />

      <Card className="w-full [--card-spacing:--spacing(6)]">
        <CardContent className="flex flex-col items-center gap-6 text-center">
          <Spinner className="size-6 text-muted-foreground" />

          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold tracking-tight">
              Connecting to Utility
            </h3>
            <p className="text-sm text-muted-foreground text-balance">
              Linking{" "}
              <span className="font-medium text-foreground">
                your utility account
              </span>{" "}
              to your workspace. This takes a few seconds.
            </p>
          </div>

          <ol className="w-full divide-y divide-border overflow-hidden rounded-lg border border-border text-left">
            {steps.map((step) => (
              <li
                key={step.label}
                className="flex items-center gap-3 px-4 py-3"
              >
                {step.status === "done" ? (
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckIcon className="size-3.5" />
                  </span>
                ) : (
                  <Spinner className="size-6 shrink-0 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    step.status === "done"
                      ? "text-muted-foreground"
                      : "font-medium text-foreground"
                  )}
                >
                  {step.label}
                </span>
              </li>
            ))}
          </ol>

          <p className="text-sm text-muted-foreground">
            Taking too long?{" "}
            <a
              href="#"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Retry the connection
            </a>{" "}
            or{" "}
            <a
              href="#"
              className="font-medium text-foreground underline underline-offset-4"
            >
              contact support
            </a>
            .
          </p>
        </CardContent>
      </Card>

      <p className="max-w-sm text-center text-sm text-muted-foreground text-balance">
        Do not close this tab. You will be redirected automatically once the
        connection completes.
      </p>
    </div>
  )
}
