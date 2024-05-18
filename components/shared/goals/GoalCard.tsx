'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { formatGoalDurationTime } from '@/lib/utils'

interface GoalCardProps {
  type: "todo" | "longterm"
  id: string;
  title: string
  description: string
  icing: string
  duration: number
  customClassName?: string
}

const GoalCard = (props: GoalCardProps) => {
  const { id, type, title, description, icing, customClassName, duration = 0 } = props
  const [isSelected, setIsSelected] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSelected = () => {
    const userIsSelected = !isSelected
    setIsSelected(userIsSelected)
    if (userIsSelected) {
      router.push(`${pathname}?archive=${id}`)
    }
  }

  return (
    <article className={`relative flex flex-col gap-1 overflow-hidden rounded-[20px] bg-white px-3 py-4 ${customClassName}`}>
      <div className='flex items-center justify-between'>
        <div className='flex-center text-400-16-20 gap-2'>
          <Button
            onClick={handleSelected}
            className={`size-[16px] rounded-full border-2 ${type === 'longterm' ? "border-purple" : "border-primary-dark"} ${isSelected && `${type === 'longterm' ? "bg-purple" : "bg-primary-dark"}`}`} size="icon">
            {isSelected && <Image src="/assets/icons/check-white.svg" alt="check" width={16} height={16} />}
          </Button>
          {title}
        </div>
        <div className='flex-center gap-2'>
          <Link href={`?edit=${id}`}>
            <Image src="/assets/icons/goal-edit.svg" alt="edit" width={28} height={28} />
          </Link>
          <Link href={`?delete=${id}`}>
            <Image src="/assets/icons/goal-delete.svg" alt="delete" width={28} height={28} />
          </Link>
        </div>
      </div>
      <span className='text-400-12-15 mb-[10px]'>
        {description}
      </span>
      {icing && (
        <span className='goal-card-icing text-400-12-15'>
          {icing}
        </span>
      )}
      {(type === 'longterm' && duration > 0) && (
        <>
          <div className='goal-card-longterm-decoration absolute inset-x-0 bottom-0 h-[6px]' />
          <div className='orange-gradient-background absolute bottom-0 right-0 h-[56px] w-[120px] translate-x-2 translate-y-8 skew-x-[-20deg] rounded-[20px] pl-5'>
            <div className='skew-x-[20deg] text-orange-dark'>
              <span>{formatGoalDurationTime(duration)}</span>
            </div>
          </div>
        </>
      )}
    </article >
  )
}
export default GoalCard