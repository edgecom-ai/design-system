import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Security from '@/components/shadcn-studio/blocks/account-settings-06/account-settings-06'

const tabs = [
  { name: 'Security', value: 'security' },
  { name: 'Preferences', value: 'preferences' },
  { name: 'Users', value: 'users' }
]

const SecuritySettings = () => {
  return (
    <div>
      <Tabs defaultValue='security'>
        <TabsList variant='line' className='w-full gap-2 rounded-none border-b p-0 sm:justify-start'>
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='not-data-active:hover:group-data-[orientation=horizontal]/tabs:after:bg-muted-foreground/30 border-0 text-base group-data-[orientation=horizontal]/tabs:after:-bottom-[0.5px] not-data-active:hover:group-data-[orientation=horizontal]/tabs:after:opacity-100 sm:flex-0'
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className='mt-6'>
        <Security />
      </div>
    </div>
  )
}

export default SecuritySettings
