import React from 'react'
import Image from 'next/image'
import { RespondSelector } from '@/components/shared/chat'

const Page = ({
  searchParams
}: {
  searchParams: {
    [key: string]: string | undefined
  }
}) => {
  const initDialog = ["Time's up!", "Have you achieved your goal?"]
  const congratulationMessage = "Wow, you did it! I’ve archived this goal for you! Find it in “Goal” on your homepage"
  const status = searchParams.status as string

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
      {status === "done" && (
        <div className="flex items-start justify-start gap-1">
          <Image src="/assets/images/emi_profile.svg" width={48} height={48} alt="avatar" className="my-2 size-[48px] rounded-full" />
          <div className="chat-bubble-container-mobile-history chat-bubble-mobile-history-ai">
            <span className="chat-text text-dark">{congratulationMessage}</span>
          </div>
        </div>
      )}
      {/* workaround in order to hide the component and at the same time execute the code within the component */}
      <div className={`flex self-end ${status && "opacity-0"}`}>
        <RespondSelector />
      </div>
    </main>
  )
}

export default Page