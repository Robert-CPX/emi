'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { RespondSelector } from '@/components/shared/chat'
import { archiveGoal } from '@/lib/actions/goal.actions'
import { USER_SELECTED_GOAL_ID } from "@/constants/constants"
import { useRouter } from 'next/navigation'

const Page = () => {
  const initDialog = ["Time's up!", "Have you achieved your goal?"]
  const congratulationMessage = "Wow, you did it! I’ve archived this goal for you! Find it in “Goal” on your homepage"

  const [status, setStatus] = useState("pending")
  const router = useRouter()

  const archiveCurrentGoal = async () => {
    const goalId = sessionStorage.getItem(USER_SELECTED_GOAL_ID)
    if (!goalId) return
    await archiveGoal({ goalId })
    setStatus("done")
    sessionStorage.removeItem(USER_SELECTED_GOAL_ID)
    setTimeout(() => {
      router.push('/cheer/congrats')
    }, 3000);
  }

  return (
    <main className='no-scrollbar flex size-full grow flex-col overflow-auto bg-dark px-4 py-24'>
      {initDialog.map((message, index) => (
        <React.Fragment key={`message-item-${index}`}>
          <div className="flex items-start justify-start gap-1">
            <Image src="/assets/images/emi_profile.svg" width={48} height={48} alt="avatar" className="my-2 size-[48px] rounded-full" />
            <div className="chat-bubble-container-mobile-history chat-bubble-mobile-history-ai">
              <span className="chat-text text-dark">{message}</span>
            </div>
          </div>
        </React.Fragment>
      ))}
      {status === "pending" && (
        <div className='flex self-end'>
          <RespondSelector
            handleNo={() => setStatus("done")}
            handleYes={archiveCurrentGoal}
          />
        </div>
      )}
      {status === "done" && (
        <div className="flex items-start justify-start gap-1">
          <Image src="/assets/images/emi_profile.svg" width={48} height={48} alt="avatar" className="my-2 size-[48px] rounded-full" />
          <div className="chat-bubble-container-mobile-history chat-bubble-mobile-history-ai">
            <span className="chat-text text-dark">{congratulationMessage}</span>
          </div>
        </div>
      )}
    </main>
  )
}

export default Page