import { PlusIcon } from 'lucide-react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

const items = [
  {
    category: 'Metering & Data',
    faqs: [
      {
        title: 'How do I track my consumption?',
        content: `Open a site in dataTrack™ and go to the "Consumption" section. You can view interval data by commodity, compare against baseline, and drill down to individual meters and channels. Data refreshes as new interval reads arrive, typically every 15 minutes.`,
        open: true
      },
      {
        title: 'Why is a meter showing as offline?',
        content:
          'A meter is flagged offline when no interval reads have arrived within the expected window. This is usually a communications or gateway issue at the site. Check the device status in Settings, and if the outage persists beyond a few hours, contact your energy manager to dispatch a check.'
      },
      {
        title: 'Can I add submeters and channels?',
        content:
          'Yes. Sites support multiple meters, submeters, and channels across Electricity, Water, Gas, IAQ, and Temperature. Add them in the site "Meters" section and map each channel to the correct commodity so consumption and cost roll up accurately.'
      }
    ]
  },
  {
    category: 'Tariffs & Cost',
    faqs: [
      {
        title: 'How is my tariff applied to consumption?',
        content:
          'Each site is linked to a rate plan defining energy and demand charges by time-of-use period. dataTrack™ applies these rates to your interval data automatically, so cost and savings always reflect your current tariff. Ask your energy manager to update a rate plan when your utility changes it.',
        open: true
      },
      {
        title: 'What is a bill anomaly and how are they detected?',
        content:
          'A bill anomaly is a utility charge that deviates significantly from expected cost given your consumption and tariff. The platform compares each bill against metered data and flags variances for review, helping you catch billing errors and unexpected demand charges before you pay.'
      },
      {
        title: 'How are cost savings calculated?',
        content:
          'Cost savings compare your actual energy cost against a measured baseline using M&V (measurement & verification) methods. Savings reflect load shifting, efficiency projects, and DR participation, and are reported per site and across your portfolio.'
      }
    ]
  },
  {
    category: 'Demand Response & Alarms',
    faqs: [
      {
        title: 'How do I enroll a site in demand response?',
        content:
          'Demand Response programs are managed in pTrack®. Select the site, choose an available DR program for your market (Ontario or Alberta), and set your curtailment target. You will receive peak alerts and event notifications ahead of each scheduled DR event.',
        open: true
      },
      {
        title: 'When do I get peak demand alerts?',
        content:
          'Peak alerts fire when a site approaches its contracted demand threshold or a forecast peak window opens. Configure alert thresholds and notification channels in Alarms so your facility managers can curtail load before a new peak is set.'
      },
      {
        title: 'How do I report an issue with a site or meter?',
        content:
          'Raise an alarm or contact your energy manager directly from the site view. Include the site name, meter ID, and a short description of the issue. Your Edgecom Energy team reviews alarms and follows up on outages and data gaps.'
      }
    ]
  }
]

const AccordionMultilevelIconDemo = () => {
  return (
    <Accordion
      className='w-full rounded-lg border [&>*>[data-slot="accordion-content"]]:px-0'
      defaultValue={['item-1']}
    >
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index + 1}`}
          className='has-focus-visible:border-ring has-focus-visible:ring-ring/50 bg-transparent outline-none first:rounded-t-lg last:rounded-b-lg has-focus-visible:z-10 has-focus-visible:ring-3'
        >
          <AccordionTrigger className='px-5 outline-none focus-visible:ring-0'>{item.category}</AccordionTrigger>
          <AccordionContent className='h-auto pb-0'>
            {item.faqs.map((faq, index) => (
              <Collapsible key={index} className='bg-background border-t px-8' defaultOpen={faq.open}>
                <CollapsibleTrigger className='focus-visible:ring-ring/50 flex w-full items-center gap-4 rounded-sm py-2.5 font-medium outline-none focus-visible:z-10 focus-visible:ring-3 aria-expanded:[&>svg]:rotate-180 [&>svg>path:last-child]:origin-center aria-expanded:[&>svg>path:last-child]:rotate-90 aria-expanded:[&>svg>path:last-child]:opacity-0'>
                  <PlusIcon className='text-muted-foreground pointer-events-none size-4 shrink-0' />
                  {faq.title}
                </CollapsibleTrigger>
                <CollapsibleContent className='text-muted-foreground overflow-hidden pb-2.5'>
                  {faq.content}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default AccordionMultilevelIconDemo
