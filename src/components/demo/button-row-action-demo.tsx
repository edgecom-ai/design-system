"use client"

import { useState } from "react"
import { BuildingIcon, PencilIcon, RotateCcwIcon, Trash2Icon } from "lucide-react"
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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
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
  { name: "Distribution Center", meters: 14, load: "1.24 MW" },
  { name: "Manufacturing Plant", meters: 9, load: "982 kW" },
  { name: "Cold Storage Facility", meters: 6, load: "410 kW" },
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
          {sites.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4} className="p-0">
                <Empty className="rounded-none border-0">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <BuildingIcon />
                    </EmptyMedia>
                    <EmptyTitle>No sites left</EmptyTitle>
                    <EmptyDescription>
                      Every site has been removed from monitoring. Add one back
                      to start tracking consumption again.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSites(initialSites)}
                    >
                      <RotateCcwIcon />
                      Restore sites
                    </Button>
                  </EmptyContent>
                </Empty>
              </TableCell>
            </TableRow>
          )}
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
