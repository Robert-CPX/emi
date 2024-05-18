import MobileNavigationBar from "@/components/shared/MobileNavigationBar"
import { GoalCard, GoalSumup, GoalListHeader, GoalForm, GoalAlertDialog } from "@/components/shared/goals"
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { getGoals, getArchivedGoals } from "@/lib/actions/goal.actions"
import { ChevronRight } from "lucide-react"

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
  const { archivedTodos, archivedLongTerms } = await getArchivedGoals({ userId })

  return (
    <div className='mx-6 mt-4 flex flex-col gap-4'>
      <MobileNavigationBar title="Goals" rootPath="/" />
      <GoalSumup title="My Goals" />
      <section>
        <GoalListHeader
          type="todo"
          isHide={todoIsHide}
        />
        {(todos.length > 0 && !todoIsHide) && (
          todos.map((goal) => (
            <GoalCard
              key={goal._id}
              id={goal._id}
              type="todo"
              title={goal.title}
              description={goal.description}
              icing={goal.icing ?? ""}
              customClassName="mb-4"
            />
          ))
        )}
      </section>
      <section>
        <GoalListHeader
          type="longterm"
          isHide={longtermIsHide}
        />
        {(longTerms.length > 0 && !longtermIsHide) && (
          longTerms.map((goal) => (
            <GoalCard
              key={goal._id}
              id={goal._id}
              type="longterm"
              title={goal.title}
              description={goal.description}
              icing={goal.icing ?? ""}
              customClassName="mb-4"
            />
          ))
        )}
      </section>
      {(archivedTodos.length > 0 || archivedLongTerms.length > 0) && (
        <section className='text-400-16-20 flex h-[50px] w-full items-center justify-between rounded-[20px] bg-light px-3 text-dark'>
          <span>Archived goals</span>
          <ChevronRight />
        </section>
      )}
      <GoalForm clerkId={userId} />
      <GoalAlertDialog />
    </div>
  )
}

export default Page
