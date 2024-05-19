import { Button } from '@/components/ui/button'
interface RespondSelectorProps {
  handleNo: () => void
  handleYes: () => void
}

const RespondSelector = (props: RespondSelectorProps) => {
  const { handleNo, handleYes } = props
  return (
    <section className='flex-center gap-4'>
      <Button
        onClick={handleNo}
        className='flex-center h-[48px] w-[120px] rounded-[24px] bg-light text-dark'>
        <span>No</span>
      </Button>
      <Button
        onClick={handleYes}
        className='flex-center h-[48px] w-[120px] rounded-[24px] bg-primary text-orange-dark'>
        <span>Yes</span>
      </Button>
    </section>
  )
}

export default RespondSelector
