'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'
import GoalsContent from './GoalsContent'
import ArchivedGoalsContent from './ArchivedGoalsContent'
import { useAuth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const GoalsContentWrapper = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showArchiveGoals, setShowArchiveGoals] = useState(false)
  const { userId } = useAuth()
  if (!userId) redirect('/sign-in')

  return (
    <section className='relative bg-transparent max-md:hidden'>
      <Button
        className="flex-center no-focus mb-4 size-[48px] rounded-full border border-dark bg-light"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image src="/assets/icons/goals-solid.svg" width={32} height={32} alt="Goal Menu Icon" />
      </Button>
      <div className='absolute flex w-[730px] gap-2'>
        {isOpen && (
          <div className='relative h-[680px] w-[360px]'>
            <GoalsContent
              userId={userId}
              handleShowArchiveGoals={() => setShowArchiveGoals(!showArchiveGoals)}
            />
          </div>
        )}
        {showArchiveGoals && (
          <div className='relative h-[680px] w-[360px]'>
            <ArchivedGoalsContent
              userId={userId}
              handleDismiss={() => setShowArchiveGoals(false)}
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default GoalsContentWrapper
