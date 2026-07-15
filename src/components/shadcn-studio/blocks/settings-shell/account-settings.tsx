import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Workspace from '@/components/shadcn-studio/blocks/account-settings-03/account-settings-03'

const tabs = [
  { name: 'Portal', value: 'workspace' },
  { name: 'Preferences', value: 'preferences' },
  { name: 'Users', value: 'users' }
]

const AccountSettings = () => {
  return (
    <div>
      <Tabs defaultValue='workspace'>
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
        <Workspace />
      </div>
    </div>
  )
}

export default AccountSettings
