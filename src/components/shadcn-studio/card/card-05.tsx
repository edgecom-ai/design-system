import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card'

const CardTopImageDemo = () => {
  return (
    <Card className='max-w-md pt-0'>
      <CardContent className='px-0'>
        <img
          src='https://cdn.shadcnstudio.com/ss-assets/components/card/image-2.png?height=280&format=auto'
          alt='Calgary Plant 2 monthly energy report'
          className='aspect-video h-70 rounded-t-xl object-cover'
        />
      </CardContent>
      <CardHeader>
        <CardTitle>Calgary Plant 2 — June Report</CardTitle>
        <CardDescription>Consumption down 4.2% month-over-month, with $8,420 in demand-charge savings.</CardDescription>
      </CardHeader>
      <CardFooter className='gap-3 max-sm:flex-col max-sm:items-stretch'>
        <Button>View dashboard</Button>
        <Button variant={'outline'}>Download report</Button>
      </CardFooter>
    </Card>
  )
}

export default CardTopImageDemo
