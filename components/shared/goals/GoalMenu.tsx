'use client'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ChevronUp, ChevronDown } from "lucide-react"
import React, { useEffect, useState } from "react"
import { getLatestGoals } from "@/lib/actions/goal.actions"
import { useAuth } from '@clerk/clerk-react';
import { Goal } from "@/constants"
import { USER_SELECTED_GOAL_ID } from "@/constants/constants"

interface GoalMenuProps {
  container?: string
  customClassName?: string
}

const GoalMenu = (props: GoalMenuProps) => {
  const { container } = props
  const [isOpen, setIsOpen] = useState(false)
  const { userId } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>()

  const handleSelectAction = (goal: Goal | null) => {
    setSelectedGoal(goal)
    if (!goal) {
      sessionStorage.removeItem(USER_SELECTED_GOAL_ID)
      return
    }
    sessionStorage.setItem(USER_SELECTED_GOAL_ID, goal._id);
  }

  useEffect(() => {
    if (!userId) return;
    const fetchGoals = async () => {
      const latestGoals = await getLatestGoals({ userId, limit: 3 })
      setGoals(latestGoals)
    }
    fetchGoals()
  }, [userId])

  return (
    <div className={`flex-center h-[42px] w-fit self-start rounded-[20px] border border-light bg-dark/50 text-light backdrop-blur sm:self-center ${props.customClassName}`}>
      <DropdownMenu
        onOpenChange={(open) => {
          setIsOpen(open)
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button className="text-600-14-17 no-focus h-[48px] w-fit gap-2">
            {selectedGoal?.title || "Goal"}
            {isOpen ? <ChevronDown /> : <ChevronUp />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="ml-5 w-[270px] rounded-[20px] border border-light bg-dark/50 px-5 py-3 text-light shadow-none backdrop-blur">
          <DropdownMenuGroup>
            <>
              <DropdownMenuItem
                className="h-[42px] w-full"
                onClick={() => handleSelectAction(null)}
              >
                <div className="text-400-14-17">None</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="separator" />
            </>

            {goals.map((goal, index) => (
              <React.Fragment key={goal._id}>
                <DropdownMenuItem
                  className="h-[42px] w-full"
                  onClick={() => handleSelectAction(goal)}
                >
                  <div className="text-400-14-17">{goal.title}</div>
                </DropdownMenuItem>
                {index < goals.length - 1 && <DropdownMenuSeparator className="separator" />}
              </React.Fragment>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default GoalMenu
