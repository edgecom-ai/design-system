import Link from 'next/link'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'

const NavigationMenuDemo = () => {
  return (
    <div className='flex items-center justify-center'>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className='[&>svg]:size-4'>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='w-80'>
                <li>
                  <NavigationMenuLink render={<Link href='#' />}>
                    <div className='flex flex-col px-1'>
                      <div className='font-medium'>dataTrack™</div>
                      <div className='text-muted-foreground text-sm'>
                        Track energy consumption, cost, and emissions across all your sites and meters.
                      </div>
                    </div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink render={<Link href='#' />}>
                    <div className='flex flex-col px-1'>
                      <div className='font-medium'>pTrack®</div>
                      <div className='text-muted-foreground text-sm'>
                        Monitor peak demand and production for the Ontario and Alberta markets.
                      </div>
                    </div>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default NavigationMenuDemo
