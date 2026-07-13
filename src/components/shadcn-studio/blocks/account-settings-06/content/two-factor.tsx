import { CircleAlertIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import VerifyDialog from '@/components/shadcn-studio/blocks/dashboard-dialog-09/dialog-verify'

const TwoFactor = () => {
  return (
    <div className='grid grid-cols-1 gap-10 lg:grid-cols-3'>
      {/* Vertical Tabs List */}
      <div className='flex flex-col space-y-1'>
        <h3 className='font-semibold'>Two Factor Authentication</h3>
        <p className='text-muted-foreground text-sm'>Manage Two Factor Authentication (2FA) settings.</p>
      </div>

      {/* Content */}
      <div className='space-y-6 lg:col-span-2'>
        {/* Enable Two Factor Authentication */}
        <Card>
          <CardContent className='flex items-center gap-2'>
            <CircleAlertIcon className='size-4' />
            <h4 className='text-sm font-medium'>You have not enabled Two Factor Authentication</h4>
          </CardContent>
          <CardContent>
            <p className='text-muted-foreground text-sm'>
              When you enable Two Factor Authentication, you will be required to provide a second form of verification
              during the login process, adding an extra layer of security to your account.
            </p>
          </CardContent>
          <CardContent>
            <VerifyDialog trigger={<Button className='max-sm:w-full'>Enable Two Factor Authentication</Button>} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TwoFactor
