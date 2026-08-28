"use client"

import { useState } from "react"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const initialSites = [
  { name: "Toronto Distribution Center", meters: 14, load: "1.24 MW" },
  { name: "Hamilton Manufacturing Plant", meters: 9, load: "982 kW" },
  { name: "Mississauga Cold Storage", meters: 6, load: "410 kW" },
]

export function ButtonRowActionDemo() {
  const [sites, setSites] = useState(initialSites)
  // A destructive action never runs straight off its trigger: the row's button
  // only opens the confirmation. `pendingSite` outlives `open` so the title
  // still names the site while the dialog animates out.
  const [pendingSite, setPendingSite] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  function askToRemove(name: string) {
    setPendingSite(name)
    setConfirmOpen(true)
  }

  function removeSite() {
    if (!pendingSite) return
    setSites((current) => current.filter((site) => site.name !== pendingSite))
    setConfirmOpen(false)
    toast.success("Site removed", {
      description: `${pendingSite} and its meters are no longer monitored.`,
    })
  }

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Site</TableHead>
            <TableHead>Meters</TableHead>
            <TableHead>Live load</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.map((site) => (
            <TableRow key={site.name}>
              <TableCell className="font-medium">{site.name}</TableCell>
              <TableCell className="tabular">{site.meters}</TableCell>
              <TableCell className="tabular">{site.load}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${site.name}`}
                        />
                      }
                    >
                      <PencilIcon />
                    </TooltipTrigger>
                    <TooltipContent>Edit site</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost-destructive"
                          size="icon-sm"
                          aria-label={`Remove ${site.name}`}
                          onClick={() => askToRemove(site.name)}
                        />
                      }
                    >
                      <Trash2Icon />
                    </TooltipTrigger>
                    <TooltipContent>Remove site</TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {pendingSite}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the site and its meters from monitoring, along with
              their historical consumption data. It can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={removeSite}>
              Remove site
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  )
}
