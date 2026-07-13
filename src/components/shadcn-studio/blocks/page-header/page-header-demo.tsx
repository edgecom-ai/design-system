import PageHeader from '@/components/shadcn-studio/blocks/page-header/page-header'

// Default: breadcrumb (with a dropdown crumb for pivoting between peers) on top of the H1.
// Every page should carry at least this.
const PageHeaderDemo = () => {
  return (
    <PageHeader
      breadcrumb={[
        { label: 'Sites', href: '#' },
        {
          label: 'Downtown Plant',
          menu: [
            { label: 'Downtown Plant', href: '#' },
            { label: 'North Warehouse', href: '#' },
            { label: 'Harbor Facility', href: '#' }
          ]
        }
      ]}
      title='Meter 12'
      titleMenu={[
        { label: 'Meter 12', href: '#' },
        { label: 'Meter 13', href: '#' },
        { label: 'Meter 14', href: '#' }
      ]}
      description='Electricity submeter · 3-phase · 400A'
    />
  )
}

export default PageHeaderDemo
