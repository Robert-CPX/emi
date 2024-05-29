import MobileNavigationBar from "@/components/shared/MobileNavigationBar"
import { GoalCard, GoalSumup, GoalListHeader, GoalForm, GoalAlertDialog } from "@/components/shared/goals"
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getGoals, checkArchiveGoalsExist } from "@/lib/actions/goal.actions"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

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
  const { todos, longTerms } = await getGoals({ userId })
  const archiveGoalsExist = await checkArchiveGoalsExist({ userId })

  return (
    <div className='mx-6 mt-4 flex flex-col gap-4'>
      <MobileNavigationBar title="Goals" rootPath="/" />
      <GoalSumup title="My Goals" />
      <section className="flex flex-col gap-0">
        <GoalListHeader
          type="todo"
          isHide={todoIsHide}
        />
        {todos.length == 0 && (
          <span className="text-400-12-15 text-dark/70">Set a todo goal now!</span>
        )}
        {(todos.length > 0 && !todoIsHide) && (
          todos.map((goal) => (
            <GoalCard
              key={goal._id}
              id={goal._id}
              type="todo"
              duration={goal.duration}
              title={goal.title}
              description={goal.description}
              icing={goal.icing ?? ""}
              customClassName="mb-4"
            />
          ))
        )}
      </section>
      <section className="flex flex-col gap-0">
        <GoalListHeader
          type="longterm"
          isHide={longtermIsHide}
        />
        {longTerms.length == 0 && (
          <span className="text-400-12-15 text-dark/70">Set a long term goal now!</span>
        )}
        {(longTerms.length > 0 && !longtermIsHide) && (
          longTerms.map((goal) => (
            <GoalCard
              key={goal._id}
              id={goal._id}
              type="longterm"
              duration={goal.duration}
              title={goal.title}
              description={goal.description}
              icing={goal.icing ?? ""}
              customClassName="mb-4"
            />
          ))
        )}
      </section>
      {archiveGoalsExist && (
        <Link href="/goals/archived" className='text-400-16-20 flex h-[50px] w-full items-center justify-between rounded-[20px] bg-light px-3 text-dark'>
          <span>Archived goals</span>
          <ChevronRight />
        </Link>
      )}
      <GoalForm clerkId={userId} />
      <GoalAlertDialog />
    </div>
  )
}

export default Page
