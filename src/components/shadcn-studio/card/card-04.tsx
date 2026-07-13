import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card'

const CardBottomImageDemo = () => {
  return (
    <Card className='max-w-md pb-0'>
      <CardHeader>
        <CardTitle>Toronto Distribution Center</CardTitle>
        <CardDescription>Real-time consumption, peak demand, and emissions across every submeter.</CardDescription>
      </CardHeader>
      <CardContent className='px-0'>
        <img
          src='https://cdn.shadcnstudio.com/ss-assets/components/card/image-1.png?height=280&format=auto'
          alt='Toronto Distribution Center site overview'
          className='aspect-video h-70 rounded-b-xl object-cover'
        />
      </CardContent>
    </Card>
  )
}

export default CardBottomImageDemo
