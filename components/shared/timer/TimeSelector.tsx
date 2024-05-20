'use client'

import { Button } from "@/components/ui/button"
import { Play, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useEmi } from "@/context/EmiProvider"
import { useEmiTime } from "@/context/EmiTimeProvider"
import { generateTimeOptions } from '@/lib/utils'
import GoalMenu from "../GoalMenu"
import { createActivity, cancelActivity } from "@/lib/actions/activity.actions"
import { useAuth } from "@clerk/nextjs"
import { USER_SELECTED_GOAL_ID, USER_ACTIVITY_ID } from "@/constants/constants"

interface TimeSelectorProps {
  unarchivedGoalExist: boolean
}

// TimeSelector component only show on mobile
const TimeSelector = (props: TimeSelectorProps) => {
  const { unarchivedGoalExist } = props
  const { userId } = useAuth()
  // use choose the time, unit second
  const [time, setTime] = useState(0)
  // display the remaining time
  const [remainMinutes, setRemainMinutes] = useState("--")
  const [remainSeconds, setRemainSeconds] = useState("--")
  const { mode } = useEmi()

  const timeOptions = generateTimeOptions()

  // store the remaining time on context
  const { time: countdown, setTime: setCountdown } = useEmiTime()
  const handleConfirm = async () => {
    setCountdown(time);
    const goalId = sessionStorage.getItem(USER_SELECTED_GOAL_ID)
    if (!goalId || !userId) return;
    const activityId = await createActivity({ type: 'goal', value: time, userId, goalId })
    sessionStorage.setItem(USER_ACTIVITY_ID, activityId)
  }

  const handleCancel = async () => {
    setCountdown(0);
    const activityId = sessionStorage.getItem(USER_ACTIVITY_ID)
    if (!activityId) return;
    await cancelActivity({ activityId })
    sessionStorage.removeItem(USER_ACTIVITY_ID)
  }

  useEffect(() => {
    setRemainMinutes(Math.floor(countdown / 60).toString().padStart(2, '0'))
    setRemainSeconds((countdown % 60).toString().padStart(2, '0'))
  }, [countdown])

  useEffect(() => {
    if (mode !== 'focus') return;
    setTime(1500);
  }, [mode, userId])

  return (
    <div className={`flex w-full flex-col items-center gap-3 text-primary-light md:hidden ${mode === 'companion' && "hidden"} ${mode === 'dredge-up' && "hidden"}`}>
      {countdown ? (
        <div className='flex w-full items-center'>
          <div className='size-[40px]' />
          <span className='mx-auto flex h-14 w-[128px] items-center justify-center rounded-[28px] border border-primary-light bg-dark/50 text-[1rem] font-[500] leading-[20px]'>
            {remainMinutes}:{remainSeconds}
          </span>
          <Button
            size="icon"
            className='size-[40px] rounded-full border border-primary-light bg-dark/50'
            onClick={handleCancel}
          >
            <X />
          </Button>
        </div>
      ) : (
        <>
          <div className='time-selector-background no-scrollbar flex h-12 w-screen overflow-x-scroll'>
            {timeOptions.map((option) => (
              <Button
                key={`${option} min`}
                className={`time-selector-item ${time === (option * 60) && '!border-primary-light bg-dark/50'}`}
                onClick={() => setTime(option * 60)}
              >
                {`${option} min`}
              </Button>
            ))}
          </div>
          <div className="flex w-full items-center justify-between">
            {unarchivedGoalExist ? <GoalMenu container="timeselector" /> : <div />}
            <Button
              size="icon"
              className='size-[40px] rounded-full border border-primary-light bg-dark/50'
              onClick={handleConfirm}
            >
              <Play />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default TimeSelector
