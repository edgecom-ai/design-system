import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { SettingsIcon, BoxIcon, ChartBarBigIcon } from "lucide-react"

const ButtonGroupGhostDemo = () => {
  return (
    <ButtonGroup>
      <Button variant='ghost'>
        <SettingsIcon
        />
        Settings
      </Button>
      <Button variant='ghost'>
        <BoxIcon
        />
        Sites
      </Button>
      <Button variant='ghost'>
        <ChartBarBigIcon
        />
        Reports
      </Button>
    </ButtonGroup>
  )
}

export default ButtonGroupGhostDemo
