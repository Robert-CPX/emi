'use client'

import { useEmi } from "@/context/EmiProvider"
import Link from "next/link"
import Image from "next/image"

const ActionMenu = () => {
  const { mode } = useEmi()

  return (
    <div className={`${(mode === 'focus' || mode === 'dredge-up') ? 'hidden' : 'flex'} flex-col gap-4`}>
      <Link href="/setting" className="flex items-center justify-center bg-transparent">
        <Image src="/assets/icons/setting.svg" alt="settings" priority={false} width={48} height={48} />
      </Link>
    </div>
  )
}

export default ActionMenu
