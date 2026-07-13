const ListDemo = () => {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <h5 className='text-foreground text-lg'>List decimal</h5>
        <ol className='list-inside list-decimal space-y-2 text-sm'>
          <li>Connect your utility account to begin importing meter data.</li>
          <li>Review consumption, cost, and emissions across your sites.</li>
          <li>Set peak-demand thresholds and enable alarm notifications.</li>
        </ol>
      </div>

      <div className='space-y-2'>
        <h5 className='text-foreground text-lg'>List disc</h5>
        <ul className='list-inside list-disc space-y-2 text-sm'>
          <li>Benefits of active energy monitoring:</li>
          <li>Lower peak-demand charges</li>
          <li>Reduced GHG emissions</li>
        </ul>
      </div>

      <div className='space-y-2'>
        <h5 className='text-foreground text-lg'>List none</h5>
        <ul className='list-inside list-none space-y-2 text-sm'>
          <li>Essential steps before a demand-response event:</li>
          <li>Verify submeter data is reporting</li>
          <li>Confirm baseline load and reduction target</li>
        </ul>
      </div>
    </div>
  )
}

export default ListDemo
