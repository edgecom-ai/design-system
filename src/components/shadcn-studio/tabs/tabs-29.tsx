'use client'

import { useLayoutEffect, useRef, useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const tabs = [
  {
    name: 'Overview',
    value: 'explore',
    content: (
      <>
        Your <span className='text-foreground font-semibold'>site summary</span> across all commodities, including
        consumption, cost and emissions trends at a glance.
      </>
    )
  },
  {
    name: 'Electricity',
    value: 'favorites',
    content: (
      <>
        Track <span className='text-foreground font-semibold'>electricity</span> consumption, peak demand and power
        factor down to the interval level for each meter.
      </>
    )
  },
  {
    name: 'Gas',
    value: 'surprise',
    content: (
      <>
        Monitor <span className='text-foreground font-semibold'>gas</span> usage in GJ, spot anomalies and compare
        against your baseline period.
      </>
    )
  }
]

const AnimatedUnderlineTabsDemo = () => {
  const [value, setValue] = useState('explore')
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [underline, setUnderline] = useState<{ left: number; width: number } | null>(null)

  // Measure the active trigger and drive the underline with concrete pixel
  // values. We read the element carrying `data-active` (Base UI's source of
  // truth) so the underline always tracks the real selection, and animate it
  // with a plain CSS transition on `left`/`width`.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const measure = () => {
      const active = root.querySelector<HTMLElement>('[data-slot=tabs-trigger][data-active]')
      if (active) {
        setUnderline({ left: active.offsetLeft, width: active.offsetWidth })
      }
    }

    // `data-active` is already committed to the DOM by the time this layout
    // effect runs, so measure synchronously. A ResizeObserver keeps the
    // underline aligned when the tab list reflows (font load, resize).
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)

    return () => {
      observer.disconnect()
    }
  }, [value])

  return (
    <div ref={rootRef} className='w-full max-w-md'>
      <Tabs value={value} onValueChange={setValue} className='gap-4'>
        <TabsList
          variant='line'
          className='bg-background relative w-full justify-start gap-4 rounded-none border-b p-0'
        >
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='flex-none rounded-none border-0 bg-transparent! px-1 pb-2.5 after:hidden data-active:text-primary data-active:shadow-none!'
            >
              {tab.name}
            </TabsTrigger>
          ))}

          <span
            className='bg-primary pointer-events-none absolute bottom-0 h-0.5 transition-all duration-300 ease-out'
            style={
              underline
                ? { left: underline.left, width: underline.width }
                : { left: 0, width: 0, opacity: 0 }
            }
          />
        </TabsList>

        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            <p className='text-muted-foreground text-sm'>{tab.content}</p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default AnimatedUnderlineTabsDemo
