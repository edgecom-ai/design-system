import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"

export function NativeSelectDemo() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      <div className="flex flex-col gap-1.5">
        <span className="text-caption text-muted-foreground">Default</span>
        <NativeSelect defaultValue="north" className="w-56" aria-label="Site">
          <NativeSelectOptGroup label="Northern region">
            <NativeSelectOption value="north">
              Distribution Center
            </NativeSelectOption>
            <NativeSelectOption value="plant">
              Manufacturing Plant
            </NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Southern region">
            <NativeSelectOption value="cold">
              Cold Storage Facility
            </NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-caption text-muted-foreground">Small</span>
        <NativeSelect size="sm" defaultValue="15m" aria-label="Interval">
          <NativeSelectOption value="15m">15 minutes</NativeSelectOption>
          <NativeSelectOption value="1h">Hourly</NativeSelectOption>
          <NativeSelectOption value="1d">Daily</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-caption text-muted-foreground">Disabled</span>
        <NativeSelect defaultValue="1h" disabled aria-label="Locked interval">
          <NativeSelectOption value="1h">Hourly</NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  )
}
