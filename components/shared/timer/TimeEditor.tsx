'use client'

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { isMinuteInRange, isSecondInRange, formatMinutesAndSeconds } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useEmi } from "@/context/EmiProvider"
import { useEmiTime } from "@/context/EmiTimeProvider"
import GoalMenu from "../goals/GoalMenu"
import { useAuth } from '@clerk/clerk-react';
import { createActivity, cancelActivity } from "@/lib/actions/activity.actions"
import { USER_SELECTED_GOAL_ID, USER_ACTIVITY_ID } from "@/constants/constants"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TimeEditorProps {
  unarchivedGoalExist: boolean
}

// TimeEditor component only show on desktop
const TimeEditor = (props: TimeEditorProps) => {
  const { unarchivedGoalExist } = props
  const [minutes, setMinutes] = useState("00")
  const [seconds, setSeconds] = useState("00")
  const minuteRef = useRef<HTMLInputElement>(null)
  const { mode } = useEmi()
  const { userId } = useAuth()
  // store the remaining time on context
  const { time: countdown, setTime: setCountdown, isRunning } = useEmiTime()

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isMinuteInRange(value)) { return; }
    setMinutes(formatMinutesAndSeconds(value));
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isSecondInRange(value)) { return; }
    setSeconds(formatMinutesAndSeconds(value));
  };

  // user start or stop the countdown
  const handleCountDownAction = async () => {
    if (isRunning) {
      setCountdown(0);
      // same logic in TimeSelector
      const activityId = sessionStorage.getItem(USER_ACTIVITY_ID)
      if (!activityId) return;
      await cancelActivity({ activityId })
      sessionStorage.removeItem(USER_ACTIVITY_ID)
    } else {
      setCountdown(parseInt(minutes) * 60 + parseInt(seconds));
      // same logic in TimeSelector
      const goalId = sessionStorage.getItem(USER_SELECTED_GOAL_ID)
      if (!goalId || !userId) return;
      const activityId = await createActivity({ type: 'goal', value: countdown, userId, goalId })
      sessionStorage.setItem(USER_ACTIVITY_ID, activityId)
    }
  };

  // update ui when time change
  useEffect(() => {
    setMinutes(formatMinutesAndSeconds(Math.floor(countdown / 60).toString()))
    setSeconds(formatMinutesAndSeconds((countdown % 60).toString()))
  }, [countdown])

  useEffect(() => {
    if (mode !== 'focus') return;
    // set a default value when switch to focus mode
    minuteRef.current?.focus();
    setMinutes("25");
    setSeconds("00");
  }, [mode])

  return (
    <div className={`isolate flex items-center justify-between gap-3 max-md:hidden ${(mode === 'companion' || mode === 'dredge-up') && "hidden"}`}>
      {unarchivedGoalExist && <GoalMenu container="timeEditor" customClassName="h-[54px] basis-[280px]" />}
      <div className="flex h-[54px] w-full items-center justify-between rounded-[22px] bg-dark/50 p-2 text-primary-light">
        <div className="ml-6 flex items-center justify-center gap-1">
          <Input
            id="minutes"
            className="input-time-editor"
            ref={minuteRef}
            value={minutes}
            disabled={isRunning}
            onChange={handleMinutesChange}
          />
          <span>:</span>
          <Input
            id="seconds"
            className="input-time-editor"
            value={seconds}
            disabled={isRunning}
            onChange={handleSecondsChange}
          />
        </div>
        {isRunning ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="h-[40px] w-[80px] rounded-[20px] bg-dark text-[1rem] font-[500] leading-[20px]">Stop</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="flex flex-col items-center justify-center">
              <AlertDialogHeader>
                <AlertDialogDescription>
                  Emi will be so lonely without you. Made your mind to stop?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-row items-baseline justify-between gap-4">
                <AlertDialogCancel className="h-[40px] w-[140px] rounded-[20px] border border-dark">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleCountDownAction} className="h-[40px] w-[140px] rounded-[20px] bg-primary">
                  Yes, stop
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            className="h-[40px] w-[80px] rounded-[20px] bg-dark text-[1rem] font-[500] leading-[20px]"
            onClick={handleCountDownAction}
          >
            Start
          </Button>
        )}
      </div>
    </div>
  )
}

export default TimeEditor