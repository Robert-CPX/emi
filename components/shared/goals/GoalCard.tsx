'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'

interface GoalCardProps {
  type: "todo" | "longterm"
  title: string
  description: string
  icing: string
  customClassName?: string;
}

const GoalCard = (props: GoalCardProps) => {
  const { type, title, description, icing, customClassName } = props
  const [isSelected, setIsSelected] = useState(false)

  const handleSelected = () => {
    const newState = !isSelected
    setIsSelected(newState)
  }

  const handleEdit = () => {
    console.log("handle edited")
  }

  const handleDelete = () => {
    console.log("handle deleted")
  }

  return (
    <article className={`flex flex-col gap-1 rounded-[20px] bg-white px-3 py-4 ${customClassName}`}>
      <div className='flex items-center justify-between'>
        <div className='flex-center text-400-16-20 gap-2'>
          <Button
            onClick={handleSelected}
            className={`size-[16px] rounded-full border-2 ${type === 'longterm' ? "border-purple" : "border-primary-dark"} ${isSelected && `${type === 'longterm' ? "bg-purple" : "bg-primary-dark"}`}`} size="icon">
            {isSelected && <Image src="/assets/icons/check-white.svg" alt="check" width={16} height={16} />}
          </Button>
          {title}
        </div>
        <div className='flex-center'>
          <Button onClick={handleEdit} size="icon">
            <Image src="/assets/icons/goal-edit.svg" alt="edit" width={28} height={28} />
          </Button>
          <Button onClick={handleDelete} size="icon">
            <Image src="/assets/icons/goal-delete.svg" alt="delete" width={28} height={28} />
          </Button>
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
    </article >
  )
}

export default GoalCard
