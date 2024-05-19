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
    // we want to keep timer alive after refreshing the page
    if (!isRunning) {
      const storedTime = parseInt(sessionStorage.getItem(COUNTDOWN_REMAINING_SECONDS) || "0")
      if (storedTime > 0) {
        setTime(storedTime)
      } else {
        sessionStorage.removeItem(COUNTDOWN_ID)
        sessionStorage.removeItem(COUNTDOWN_REMAINING_SECONDS)
        // auto switch to companion mode when countdown end
        setMode('companion')
      }
      return
    }

    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          setIsRunning(false)
          clearInterval(interval)
          return 0
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
    if (time === 0) {
      setIsRunning(false)
      sessionStorage.setItem(COUNTDOWN_REMAINING_SECONDS, "0")
    } else {

      // only the first time user set a timer, save user interaction to db
      if (!isRunning) {
        saveUserInteraction(time)
      }

      setIsRunning(true)
      sessionStorage.setItem(COUNTDOWN_REMAINING_SECONDS, time.toString())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
