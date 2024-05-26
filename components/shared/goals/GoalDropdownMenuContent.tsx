'use client'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEmi } from "@/context/EmiProvider"
import { useEffect, useState } from "react"
import { playSound } from "@/lib/utils"
import { AUDIO_RESOURCES } from "@/constants/constants"
import Image from "next/image"
import GoalSumup from "./GoalSumup"
import GoalListHeader, { HIDE_TODO_KEY, HIDE_LONGTERM_KEY } from "./GoalListHeader"
import GoalCard from "./GoalCard"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { getGoals, checkArchiveGoalsExist } from "@/lib/actions/goal.actions"
import { Goal } from "@/constants"
import { redirect } from "next/navigation"
import { useSearchParams } from 'next/navigation';

const GoalDropdownMenuContent = () => {
  const { mode } = useEmi()
  const [todoIsHide, setTodoIsHide] = useState(false)
  const [longtermIsHide, setLongtermIsHide] = useState(false)
  const [archiveGoalsExist, setArchiveGoalsExist] = useState(false)
  const [todos, setTodos] = useState<Goal[]>([])
  const [longTerms, setLongTerms] = useState<Goal[]>([])
  const searchParams = useSearchParams()
  const hideTodo = searchParams.get(HIDE_TODO_KEY)
  const hideLongterm = searchParams.get(HIDE_LONGTERM_KEY)
  const { userId } = useAuth()
  if (!userId) redirect('/sign-in')

  useEffect(() => {
    const fetchGoals = async () => {
      const { todos, longTerms } = await getGoals({ userId })
      setTodos(todos)
      setLongTerms(longTerms)
      const archiveGoalsExist = await checkArchiveGoalsExist({ userId })
      setArchiveGoalsExist(archiveGoalsExist)
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
    <div className="self-start rounded-full border border-dark bg-light max-md:hidden">
      <DropdownMenu
        onOpenChange={() => {
          playSound(AUDIO_RESOURCES.CLICK_SOUND)
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button className="flex-center no-focus size-[48px]">
            <Image src="/assets/icons/goals-solid.svg" width={32} height={32} alt="Goal Menu Icon" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="no-scrollbar ml-8 mt-3 max-h-[680px] w-[390px] overflow-auto rounded-[20px] border border-dark">
          <DropdownMenuGroup>
            <div className='m-4 flex flex-col gap-4'>
              <span className="text-700-16-20 uppercase">Goals</span>
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
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default GoalDropdownMenuContent
