"use client"

import { COUNTDOWN_ID, COUNTDOWN_REMAINING_SECONDS } from "@/constants/constants"
import React, { createContext, useContext, useEffect, useState } from "react"
import { useEmi } from "./EmiProvider"
import { setANewTimer } from "@/lib/actions/interaction.actions"
import { useAuth } from "@clerk/nextjs"

type EmiTimeContextType = {
  time: number // in seconds
  setTime: (newTime: number) => void
  isRunning: boolean // countdown is running or not
  setIsRunning: (newIsRunning: boolean) => void
}

const EmiTimeContext = createContext<EmiTimeContextType | undefined>(undefined)

const EmiTimeProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const { setMode } = useEmi()
  const { userId } = useAuth()

  useEffect(() => {
    if (!isRunning) {
      // resume the timer after refreshing the page if it's not finished
      const storedTime = parseInt(sessionStorage.getItem(COUNTDOWN_REMAINING_SECONDS) || "0")
      if (storedTime > 0) {
        setTime(storedTime)
      } else {
        sessionStorage.removeItem(COUNTDOWN_ID)
        sessionStorage.removeItem(COUNTDOWN_REMAINING_SECONDS)
      }
      return
    }

    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          setMode('cheer')
          clearInterval(interval)
        }
        return prevTime - 1
      })
    }, 1000)

    sessionStorage.setItem(COUNTDOWN_ID, interval.toString());
    // auto switch to focus mode when countdown start
    setMode('focus')

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning])

  useEffect(() => {
    setIsRunning(time > 0)
    // save time in sessionStorage, so that the timer can be resumed after refreshing the page
    sessionStorage.setItem(COUNTDOWN_REMAINING_SECONDS, time.toString())
  }, [time])

  // save user interaction to db
  const saveUserInteraction = async (time: number) => {
    if (userId) {
      await setANewTimer({ userId: userId, time })
    }
  }
  return (
    <EmiTimeContext.Provider
      value={{ time, setTime, isRunning, setIsRunning }}
    >
      {children}
    </EmiTimeContext.Provider>
  )
}

export function useEmiTime() {
  const context = useContext(EmiTimeContext)
  if (context === undefined) {
    throw new Error('useEmiTime must be used within a EmiTimeProvider')
  }
  return context
}

export default EmiTimeProvider
