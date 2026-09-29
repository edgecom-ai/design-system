"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type Project = {
  id: number
  name: string
  owner: string
  visibility: string
  updated: string
}

const seed: Project[] = [
  { id: 1, name: "Website refresh", owner: "Maya Okafor", visibility: "Team", updated: "Jun 14" },
  { id: 2, name: "Spring catalog", owner: "Lin Ferreira", visibility: "Team", updated: "Jun 12" },
  { id: 3, name: "Mobile app", owner: "Sam Delacroix", visibility: "Private", updated: "Jun 15" },
  { id: 4, name: "Help center", owner: "Maya Okafor", visibility: "Public", updated: "Jun 9" },
  { id: 5, name: "Brand guidelines", owner: "Ivo Marsh", visibility: "Team", updated: "May 30" },
  { id: 6, name: "Quarterly planning", owner: "Lin Ferreira", visibility: "Private", updated: "Jun 2" },
  { id: 7, name: "Customer survey", owner: "Ivo Marsh", visibility: "Team", updated: "Jun 11" },
  { id: 8, name: "Holiday campaign", owner: "Sam Delacroix", visibility: "Team", updated: "May 21" },
  { id: 9, name: "Onboarding emails", owner: "Maya Okafor", visibility: "Team", updated: "Jun 13" },
  { id: 10, name: "Pricing page", owner: "Lin Ferreira", visibility: "Public", updated: "Jun 10" },
  { id: 11, name: "Partner portal", owner: "Ivo Marsh", visibility: "Private", updated: "May 27" },
  { id: 12, name: "Data cleanup", owner: "Sam Delacroix", visibility: "Private", updated: "Jun 4" },
]

const PAGE_SIZE = 5
const owners = ["Maya Okafor", "Lin Ferreira", "Sam Delacroix", "Ivo Marsh"].map((name) => ({ value: name, label: name }))
const visibilities = ["Private", "Team", "Public"].map((value) => ({ value, label: value }))

// The first and last cells sit on the card's own content line.
const edge = "first:pl-(--card-spacing) last:pr-(--card-spacing)"

type Draft = Omit<Project, "id" | "updated">
const emptyDraft: Draft = { name: "", owner: owners[0].value, visibility: "Team" }

function DraftSelect({
  id,
  label,
  items,
  value,
  onChange,
}: {
  id: string
  label: string
  items: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select items={items} value={value} onValueChange={(next) => next && onChange(next)}>
        <SelectTrigger id={id} className="w-full">
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
    </Field>
  )
}

// One dialog for both create and edit: the title follows whether a project
// was passed, and errors show only after a save is attempted. The parent
// re-keys it on every open, so it always starts from the project (or blank).
function ProjectFormDialog({
  open,
  project,
  onOpenChange,
  onSave,
}: {
  open: boolean
  project: Project | undefined
  onOpenChange: (open: boolean) => void
  onSave: (draft: Draft) => void
}) {
  const [draft, setDraft] = React.useState<Draft>(project ?? emptyDraft)
  const [tried, setTried] = React.useState(false)
  const nameError = tried && draft.name.trim() === "" ? "Project name is required." : undefined

  function submit() {
    setTried(true)
    if (draft.name.trim() === "") return
    onSave(draft)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{project ? "Edit project" : "New project"}</DialogTitle>
          <DialogDescription>
            {project ? "Rename the project or change who can see it." : "Start a project and choose who can see it."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field className="sm:col-span-2" data-invalid={nameError ? true : undefined}>
            <FieldLabel htmlFor="project-name">Name</FieldLabel>
            <Input
              id="project-name"
              value={draft.name}
              aria-invalid={nameError ? true : undefined}
              onChange={(event) => setDraft((previous) => ({ ...previous, name: event.target.value }))}
            />
            {nameError && <FieldError>{nameError}</FieldError>}
          </Field>
          <DraftSelect
            id="project-owner"
            label="Owner"
            items={owners}
            value={draft.owner}
            onChange={(owner) => setDraft((previous) => ({ ...previous, owner }))}
          />
          <DraftSelect
            id="project-visibility"
            label="Visibility"
            items={visibilities}
            value={draft.visibility}
            onChange={(visibility) => setDraft((previous) => ({ ...previous, visibility }))}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>{project ? "Save" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RowAction({
  label,
  destructive,
  onClick,
  children,
}: {
  label: string
  destructive?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant={destructive ? "ghost-destructive" : "ghost"} size="icon-sm" aria-label={label} onClick={onClick}>
            {children}
          </Button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export function DatatableListCardDemo() {
  const [projects, setProjects] = React.useState(seed)
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc")
  const [page, setPage] = React.useState(1)
  const [formOpen, setFormOpen] = React.useState(false)
  const [edited, setEdited] = React.useState<Project>()
  const [removing, setRemoving] = React.useState<Project>()
  const [formKey, setFormKey] = React.useState(0)

  function openForm(project?: Project) {
    setEdited(project)
    setFormKey((key) => key + 1)
    setFormOpen(true)
  }

  const sorted = [...projects].sort(
    (a, b) => a.name.localeCompare(b.name) * (sortDir === "asc" ? 1 : -1)
  )
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const rows = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const from = sorted.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1
  const to = Math.min(current * PAGE_SIZE, sorted.length)
  const SortIcon = sortDir === "asc" ? ChevronUpIcon : ChevronDownIcon

  function save(draft: Draft) {
    if (edited) {
      setProjects((previous) =>
        previous.map((item) => (item.id === edited.id ? { ...item, ...draft, updated: "Jun 15" } : item))
      )
      toast.success("Project updated", { description: `${draft.name} is saved.` })
    } else {
      setProjects((previous) => [...previous, { id: Date.now(), ...draft, updated: "Jun 15" }])
      toast.success("Project created", { description: `${draft.name} is ready for its first task.` })
    }
    setFormOpen(false)
  }

  function remove() {
    if (!removing) return
    setProjects((previous) => previous.filter((item) => item.id !== removing.id))
    toast.success("Project deleted", { description: `${removing.name} and its tasks were deleted.` })
    setRemoving(undefined)
  }

  const go = (next: number) => (event: React.MouseEvent) => {
    event.preventDefault()
    setPage(next)
  }

  return (
    <Card className="w-full gap-0 py-0">
      <CardHeader className="flex items-center justify-between border-b py-4">
        <span className="text-body-sm text-muted-foreground">{projects.length} projects</span>
        <CardAction>
          <Button onClick={() => openForm()}>
            <PlusIcon data-icon="inline-start" />
            New project
          </Button>
        </CardAction>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={edge} aria-sort={sortDir === "asc" ? "ascending" : "descending"}>
              <button
                type="button"
                className="-ml-1 inline-flex cursor-pointer items-center gap-1 rounded-sm px-1 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                onClick={() => setSortDir((dir) => (dir === "asc" ? "desc" : "asc"))}
              >
                Name
                <SortIcon className="size-3.5 text-muted-foreground" aria-hidden />
              </button>
            </TableHead>
            <TableHead className={edge}>Owner</TableHead>
            <TableHead className={edge}>Visibility</TableHead>
            <TableHead className={edge}>Updated</TableHead>
            <TableHead className={edge}>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((project) => (
            <TableRow key={project.id}>
              <TableCell className={cn(edge, "font-medium")}>{project.name}</TableCell>
              <TableCell className={edge}>{project.owner}</TableCell>
              <TableCell className={cn(edge, "text-muted-foreground")}>{project.visibility}</TableCell>
              <TableCell className={cn(edge, "text-muted-foreground tabular-nums")}>{project.updated}</TableCell>
              <TableCell className={cn(edge, "text-right")}>
                <div className="flex justify-end gap-1">
                  <RowAction label={`Edit ${project.name}`} onClick={() => openForm(project)}>
                    <PencilIcon />
                  </RowAction>
                  <RowAction label={`Delete ${project.name}`} destructive onClick={() => setRemoving(project)}>
                    <Trash2Icon />
                  </RowAction>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No projects yet. Create one to start adding tasks.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CardFooter className="flex-wrap justify-between gap-4 py-3">
        <span className="text-body-sm whitespace-nowrap text-muted-foreground tabular-nums">
          Showing {from}–{to} of {sorted.length} projects
        </span>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" disabled={current === 1} onClick={go(current - 1)} />
            </PaginationItem>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <PaginationItem key={number}>
                <PaginationLink href="#" isActive={number === current} onClick={go(number)}>
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" disabled={current === pageCount} onClick={go(current + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>

      <ProjectFormDialog key={formKey} open={formOpen} project={edited} onOpenChange={setFormOpen} onSave={save} />

      <AlertDialog open={removing !== undefined} onOpenChange={(open) => !open && setRemoving(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <TriangleAlertIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete {removing?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Its tasks, files and comments are deleted for everyone in the workspace. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep project</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={remove}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
