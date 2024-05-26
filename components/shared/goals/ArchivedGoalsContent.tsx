'use client'
import { getArchivedGoals } from '@/lib/actions/goal.actions'
import { useEffect, useState } from 'react'
import { Goal } from "@/constants"
import { useSearchParams } from 'next/navigation'
import GoalListHeader, { HIDE_TODO_KEY, HIDE_LONGTERM_KEY } from "./GoalListHeader"
import Image from 'next/image'
import { formatGoalDurationTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface ArchivedGoalsContentProps {
  userId: string
  handleDismiss: () => void
}

const ArchivedGoalsContent = (props: ArchivedGoalsContentProps) => {
  const { userId } = props
  const searchParams = useSearchParams()
  const hideTodo = searchParams.get(HIDE_TODO_KEY)
  const hideLongterm = searchParams.get(HIDE_LONGTERM_KEY)
  const [todoIsHide, setTodoIsHide] = useState(false)
  const [longtermIsHide, setLongtermIsHide] = useState(false)
  const [archivedTodos, setArchivedTodos] = useState<Goal[]>([])
  const [archivedLongTerms, setArchivedLongTerms] = useState<Goal[]>([])

  useEffect(() => {
    const fetchGoals = async () => {
      const { archivedTodos, archivedLongTerms } = await getArchivedGoals({ userId })
      setArchivedTodos(archivedTodos)
      setArchivedLongTerms(archivedLongTerms)
      console.log(archivedTodos, archivedLongTerms)
    }
    fetchGoals()
  }, [userId])

  useEffect(() => {
    if (hideTodo) {
      setTodoIsHide(hideTodo === "1")
    }
    if (hideLongterm) {
      setLongtermIsHide(hideLongterm === "1")
    }
  }, [hideTodo, hideLongterm])

  return (
    <div className="no-scrollbar flex flex-col gap-4 overflow-auto rounded-[20px] border border-dark">
      <div className='relative inset-x-0 top-0 flex h-[56px] items-center justify-between bg-light p-4'>
        <span className="text-700-16-20 uppercase">Archived Goals</span>
        <Button
          className='mr-0'
          onClick={props.handleDismiss}
        >
          <X />
        </Button>
      </div>
      <section className='p-4'>
        <GoalListHeader
          type="todo"
          isHide={todoIsHide}
          disableAddAction
        />
        {(archivedTodos.length > 0 && !todoIsHide) && (
          archivedTodos.map((goal) => (
            <article
              key={goal._id}
              className="text-400-16-20 mb-4 flex items-center justify-start gap-3 rounded-[20px] bg-light px-3 py-4"
            >
              <div className={`size-[16px] rounded-full bg-gray`}>
                <Image src="/assets/icons/check-white.svg" alt="check" width={16} height={16} />
              </div>
              <span>{goal.title}</span>
            </article>
          ))
        )}
      </section>
      <section className='p-4'>
        <GoalListHeader
          type="longterm"
          isHide={longtermIsHide}
          disableAddAction
        />
        {(archivedLongTerms.length > 0 && !longtermIsHide) && (
          archivedLongTerms.map((goal) => (
            <article
              key={goal._id}
              className="text-400-16-20 relative mb-4 flex items-center justify-start gap-3 overflow-hidden rounded-[20px] bg-light px-3 py-4"
            >
              <div className={`size-[16px] rounded-full bg-gray`}>
                <Image src="/assets/icons/check-white.svg" alt="check" width={16} height={16} />
              </div>
              <span>{goal.title}</span>
              {(goal.duration > 0) && (
                <div className="orange-gradient-background absolute inset-y-0 right-[-16px] h-full w-[100px] skew-x-[-30deg]">
                  <div className="relative skew-x-[30deg] p-4">
                    <span className="text-400-12-15 text-orange-dark">{formatGoalDurationTime(goal.duration)}</span>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </div >
  )
}

export default ArchivedGoalsContent
