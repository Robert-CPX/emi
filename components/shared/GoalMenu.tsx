'use client'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ChevronUp, ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import { getLatestGoals } from "@/lib/actions/goal.actions"
import { useAuth } from "@clerk/nextjs"

interface GoalMenuProps {
  container?: string
}
const GoalMenu = (props: GoalMenuProps) => {
  const { container } = props
  const [isOpen, setIsOpen] = useState(false)
  const { userId } = useAuth()
  const [goals, setGoals] = useState<{ _id: string, title: string, description: string }[]>([])
  const [selectedGoal, setSelectedGoal] = useState("Goal")

  useEffect(() => {
    if (!userId) return;
    const fetchGoals = async () => {
      const latestGoals = await getLatestGoals({ userId, limit: 4 })
      setGoals(latestGoals)
    }
    fetchGoals()
  }, [userId, container])

  return (
    <div className="flex-center h-[42px] w-fit self-start rounded-[20px] border border-light bg-dark/50 text-light backdrop-blur sm:hidden">
      <DropdownMenu
        onOpenChange={(open) => {
          setIsOpen(open)
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button className="text-600-14-17 no-focus h-[48px] w-fit gap-2">
            {selectedGoal}
            {isOpen ? <ChevronDown /> : <ChevronUp />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="ml-5 w-[270px] rounded-[20px] border border-light bg-dark/50 px-5 py-3 text-light shadow-none backdrop-blur">
          <DropdownMenuGroup>
            <>
              <DropdownMenuItem
                className="h-[42px] w-full"
                onClick={() => setSelectedGoal("Goal")}
              >
                <div className="text-400-14-17">None</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="separator" />
            </>

            {goals.map((goal, index) => (
              <>
                <DropdownMenuItem
                  key={index}
                  className="h-[42px] w-full"
                  onClick={() => setSelectedGoal(goal.title)}
                >
                  <div className="text-400-14-17">{goal.title}</div>
                </DropdownMenuItem>
                {index < goals.length - 1 && <DropdownMenuSeparator className="separator" />}
              </>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default GoalMenu
