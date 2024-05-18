'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight } from "lucide-react"
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';

const HIDE_TODO_KEY = "hideTodo"
const HIDE_LONGTERM_KEY = "hideLongterm"

interface GoalListHeaderProps {
  type: "todo" | "longterm"
  isHide: boolean
}

const GoalListHeader = (props: GoalListHeaderProps) => {
  const { type, isHide } = props
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleOpenAction = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (type === "todo") {
      params.set(HIDE_TODO_KEY, encodeURI(`${isHide ? "0" : "1"}`))
    } else {
      params.set(HIDE_LONGTERM_KEY, encodeURI(`${isHide ? "0" : "1"}`))
    }
    router.push(`?${params}`)
  }

  return (
    <div className='flex items-center justify-between'>
      <Button
        onClick={handleOpenAction}
        className='text-400-16-20 flex-center pl-1'
      >
        {type === "todo" ? "Todo" : "Long term"}
        {isHide ? <ChevronRight /> : <ChevronDown />}
      </Button>
      <Link href={`?add=${type}`}>
        <Button
          className='my-2 rounded-[20px] border border-dark px-4 py-2 text-dark'
        >
          Add
        </Button>
      </Link>
    </div>
  )
}

export default GoalListHeader
