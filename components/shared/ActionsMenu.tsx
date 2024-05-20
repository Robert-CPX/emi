'use client'

import { useEmi } from "@/context/EmiProvider"
import Link from "next/link"
import Image from "next/image"
import { playSound } from "@/lib/utils"
import { AUDIO_RESOURCES } from "@/constants/constants"
import { VolumeX, Volume2 } from 'lucide-react';

const ActionsMenu = () => {
  const { mode, isBGMMuted, setIsBGMMuted } = useEmi()

  return (
    <div className={`${(mode === 'focus' || mode === 'dredge-up') ? 'hidden' : 'flex'} flex-col gap-4`}>
      <Link href="/setting" className="flex items-center justify-center bg-transparent" onClick={() => playSound(AUDIO_RESOURCES.CLICK_SOUND)}>
        <Image src="/assets/icons/setting.svg" alt="settings" priority={false} width={48} height={48} />
      </Link>
      <Link href="/goals" className="flex items-center justify-center bg-transparent">
        <Image src="/assets/icons/goals.svg" alt="goals" priority={false} width={48} height={48} />
      </Link>
      <button 
        onClick={() => setIsBGMMuted(!isBGMMuted)}
        className="rounded-full bg-gray-900/30 p-3 text-gray-200 shadow-lg focus:outline-none"
      >
        {isBGMMuted ? <VolumeX /> : <Volume2 />}
      </button>
    </div>
  )
}

export default ActionsMenu
