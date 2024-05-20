'use client'

import Link from "next/link"
import { completeActivity } from "@/lib/actions/activity.actions"
import { archiveGoal } from '@/lib/actions/goal.actions'
import { USER_SELECTED_GOAL_ID, USER_ACTIVITY_ID } from "@/constants/constants"
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from "react"

const RespondSelector = () => {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const router = useRouter()
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    const processYes = async () => {
      const goalId = sessionStorage.getItem(USER_SELECTED_GOAL_ID)
      const activityId = sessionStorage.getItem(USER_ACTIVITY_ID)
      if (!goalId || !activityId) {
        return router.push(`/`)
      }
      await completeActivity({ activityId })
      await archiveGoal({ goalId })
      sessionStorage.removeItem(USER_SELECTED_GOAL_ID)
      sessionStorage.removeItem(USER_ACTIVITY_ID)
      params.set('goalId', goalId)
      setTimeout(() => {
        router.push(`/cheer/congrats?${params}`)
      }, 3000);
    }

    const processNo = async () => {
      const goalId = sessionStorage.getItem(USER_SELECTED_GOAL_ID)
      const activityId = sessionStorage.getItem(USER_ACTIVITY_ID)
      if (activityId) {
        await completeActivity({ activityId })
        sessionStorage.removeItem(USER_ACTIVITY_ID)
      }
      params.set('goalId', goalId ?? "")
      setTimeout(() => {
        router.push(`/cheer/congrats?${params}`)
      }, 1000);
    }

    if (status === 'done') {
      processYes()
    } else if (status === 'inprogress') {
      processNo()
    }
  }, [router, searchParams, status])

  return (
    <section className="flex-center gap-4">
      <Link
        href={{ pathname: '/cheer', query: { status: 'inprogress' } }}
        className='flex-center h-[48px] w-[120px] rounded-[24px] bg-light text-dark'>
        <span>No</span>
      </Link>
      <Link
        href={{ pathname: '/cheer', query: { status: 'done' } }}
        className='flex-center h-[48px] w-[120px] rounded-[24px] bg-primary text-orange-dark'>
        <span>Yes</span>
      </Link>
    </section>
  )
}

export default RespondSelector
