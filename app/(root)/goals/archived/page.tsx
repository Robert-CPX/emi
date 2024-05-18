import MobileNavigationBar from "@/components/shared/MobileNavigationBar"
import { GoalListHeader } from "@/components/shared/goals"
import { getArchivedGoals } from "@/lib/actions/goal.actions"
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { formatGoalDurationTime } from '@/lib/utils'

const Page = async ({
  searchParams
}: {
  searchParams: {
    [key: string]: string | number | undefined
  }
}) => {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')
  const todoIsHide = searchParams.hideTodo as string === "1"
  const longtermIsHide = searchParams.hideLongterm as string === "1"
  const { archivedTodos, archivedLongTerms } = await getArchivedGoals({ userId })

  return (
    <div className='mx-6 mt-4 flex flex-col gap-4'>
      <MobileNavigationBar title="Archived Goals" allowBack rootPath="/goals" />
      <section>
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
      <section>
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

export default Page
