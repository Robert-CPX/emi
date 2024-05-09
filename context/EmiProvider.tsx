"use client"

import { EmotionEvent } from "@inworld/web-core"
import React, { useState, createContext, useContext } from "react"

export type ModeType = "companion" | "focus" | "dredge-up"

type EmiContextType = {
  mode: ModeType
  setMode: (newMode: ModeType) => void
  emotion: EmotionEvent | null
  setEmotion: (newEmotion: EmotionEvent) => void
}

const EmiContext = createContext<EmiContextType | undefined>(undefined)

export const EmiProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [mode, setMode] = useState<ModeType>("companion")
  const [emotion, setEmotion] = useState<EmotionEvent | null>(null)

  return (
    <EmiContext.Provider value={{ mode, setMode, emotion, setEmotion }}>
      {children}
    </EmiContext.Provider>
  )
}

export function useEmi() {
  const context = useContext(EmiContext)
  if (context === undefined) {
    throw new Error('useEmi must be used within a EmiProvider')
  }
  return context
}

export default EmiProvider