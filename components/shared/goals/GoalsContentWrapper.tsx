'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'
import GoalsContent from './GoalsContent'

const GoalsContentWrapper = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <section className='relative bg-transparent max-md:hidden'>
      <Button
        className="flex-center no-focus mb-4 size-[48px] rounded-full border border-dark bg-light"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image src="/assets/icons/goals-solid.svg" width={32} height={32} alt="Goal Menu Icon" />
      </Button>
      {isOpen && (
        <div className='relative h-[680px] w-[360px]'>
          <GoalsContent />
        </div>
      )}
    </section>
  )
}

export default GoalsContentWrapper
