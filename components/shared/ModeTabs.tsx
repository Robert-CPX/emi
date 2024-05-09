'use client'

import { useEffect, useState } from "react"
import { TabData, TabDataMobile } from "@/constants/constants"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useEmi, ModeType } from "@/context/EmiProvider"
import { useEmiTime } from "@/context/EmiTimeProvider"
import { TabDataType } from "@/constants"

const ModeTabs = () => {
  const [modeData, setModeData] = useState<TabDataType | null>(null);
  const { mode: currentMode, setMode } = useEmi();
  const { isRunning } = useEmiTime();

  const handleResize = () => {
    if (window.innerWidth > 768) {
      setModeData(TabData);
    } else {
      setModeData(TabDataMobile);
    }
  }

  useEffect(() => {
    // handle initial resize
    setModeData(window.innerWidth > 768 ? TabData : TabDataMobile);
    // handle subsequent resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`relative isolate flex h-[44px] items-center justify-center md:w-[248px] ${isRunning && 'hidden'}`}>
      <div className='absolute inset-0 -z-10 rounded-[22px] bg-dark/50'></div>
      <Tabs defaultValue="companion" className='px-2 text-light'>
        <TabsList
          className="flex items-center justify-center gap-4"
          defaultValue={currentMode}>
          {modeData?.map((mode) => (
            <TabsTrigger
              key={mode.name}
              value={mode.value}
              className={`min-w-[80px] rounded-[20px] px-5 py-2 text-[0.75rem] font-[700] uppercase leading-[15px] ${currentMode === mode.value && 'border border-dark bg-primary text-dark outline outline-offset-[-2] outline-primary'}`}
              onClick={() => setMode(mode.value as ModeType)}
            >
              {mode.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

export default ModeTabs