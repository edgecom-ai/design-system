import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const items = [
  {
    title: 'How do I add a new meter to a site?',
    content: `Open the site in dataTrack™ and go to the "Meters" section. Click "Add meter," then enter the meter ID, commodity (Electricity, Water, or Gas), and the channel mapping. New meters begin reporting interval data within 24 hours of provisioning.`
  },
  {
    title: 'How is my tariff applied to consumption?',
    content:
      'Each site is linked to a rate plan that defines energy and demand charges by time-of-use period. dataTrack™ applies these rates to your interval data automatically, so cost and savings figures always reflect your current tariff. Contact your energy manager to update a rate plan.'
  },
  {
    title: 'How do I enroll a site in a demand-response program?',
    content:
      'Demand Response programs are managed in pTrack®. Select the site, choose an available DR program for your market (Ontario or Alberta), and set your curtailment target. You will receive peak alerts and event notifications ahead of each scheduled DR event.'
  }
]

const AccordionDemo = () => {
  return (
    <Accordion className='w-full' defaultValue={['item-1']}>
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent className='text-muted-foreground'>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default AccordionDemo
