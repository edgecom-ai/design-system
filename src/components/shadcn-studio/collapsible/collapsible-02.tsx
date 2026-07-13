import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { FileIcon, ChevronRightIcon, FolderIcon, FolderOpenIcon } from "lucide-react"

type FileTreeItem = {
  name: string
} & (
  | {
      type: 'file'
      children?: never
    }
  | {
      type: 'folder'
      children: FileTreeItem[]
    }
)

const fileTree: FileTreeItem[] = [
  {
    name: 'Toronto Distribution Center',
    type: 'folder',
    children: [
      {
        name: 'Main Building',
        type: 'folder',
        children: [
          { name: 'Main Incomer', type: 'file' },
          { name: 'HVAC Panel', type: 'file' },
          { name: 'Lighting Panel', type: 'file' }
        ]
      },
      { name: 'Rooftop Solar', type: 'file' }
    ]
  },
  {
    name: 'Calgary Plant 2',
    type: 'folder',
    children: [{ name: 'Chiller Plant', type: 'file' }]
  },
  {
    name: 'HQ – Bay Street',
    type: 'folder',
    children: [{ name: 'Floor 3 Submeter', type: 'file' }]
  },
  {
    name: 'Warehouse B',
    type: 'file'
  }
]

const FileTree = ({ item, level }: { level: number; item: FileTreeItem }) => {
  if (item.type === 'file') {
    return (
      <div
        className='focus-visible:ring-ring/50 flex items-center gap-2 rounded-md p-1 outline-none focus-visible:ring-[3px]'
        style={{ paddingLeft: `${level === 0 ? 1.75 : 3.25}rem` }}
      >
        <FileIcon className='size-4 shrink-0' />
        <span className='text-muted-foreground text-sm'>{item.name}</span>
      </div>
    )
  }

  return (
    <Collapsible className='flex flex-col gap-1.5' style={{ paddingLeft: `${level === 0 ? 0 : 1.5}rem` }}>
      <CollapsibleTrigger className='focus-visible:ring-ring/50 flex items-center gap-2 rounded-md p-1 outline-none focus-visible:ring-[3px]'>
        <ChevronRightIcon className='size-4 shrink-0 transition-transform in-data-closed:rotate-0 in-data-open:rotate-90' />
        <FolderIcon className='size-4 shrink-0 in-data-closed:block in-data-open:hidden' />
        <FolderOpenIcon className='in-data-open:block: size-4 shrink-0 in-data-closed:hidden' />
        <span className='text-sm'>{item.name}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className='flex flex-col gap-1.5'>
        {item.children.map(item => (
          <FileTree key={item.name} item={item} level={level + 1} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

const CollapsibleTreeDemo = () => {
  return (
    <div className='flex w-full max-w-48 flex-col gap-2'>
      {fileTree.map(item => (
        <FileTree key={item.name} item={item} level={0} />
      ))}
    </div>
  )
}

export default CollapsibleTreeDemo
