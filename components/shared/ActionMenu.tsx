'use client'

import { useEmi } from "@/context/EmiProvider"
import Link from "next/link"
import Image from "next/image"
import { playSound } from "@/lib/utils"
import { AUDIO_RESOURCES } from "@/constants/constants"

const ActionMenu = () => {
  const { mode } = useEmi()

  return (
    <div className={`${(mode === 'focus' || mode === 'dredge-up') ? 'hidden' : 'flex'} flex-col gap-4`}>
      <Link href="/setting" className="flex items-center justify-center bg-transparent" onClick={() => playSound(AUDIO_RESOURCES.CLICK_SOUND)}>
        <Image src="/assets/icons/setting.svg" alt="settings" priority={false} width={48} height={48} />
      </Link>
    </div>
  )
}

export default ActionMenu
