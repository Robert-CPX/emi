import Emi from "@/components/shared/Emi"
import ModeTabs from "@/components/shared/ModeTabs"
import BrandMenu from "@/components/shared/brand-menu"
import { Chat, ChatMobileBackground, ChatHistoryMobile } from "@/components/shared/chat"
import ActionsMenu from "@/components/shared/ActionsMenu"
import { TimeEditor, TimeSelector } from "@/components/shared/timer"
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'

const Home = () => {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')
  return (
    <>
      {/* Emi as background */}
      <div className="emi-main">
        <Emi />
      </div>
      <div className="isolate flex h-full justify-between p-4 max-md:flex-col md:px-8">
        {/* Brand menu only show on desktop */}
        <BrandMenu />
        {/* this section is on top */}
        <section className="z-10 flex flex-col items-center justify-start gap-4">
          {/* Mode Tabs disappear only when timer is running */}
          <ModeTabs />
          {/* Time Editor only show on desktop */}
          <TimeEditor />
          {/* Time Selector only show on mobile */}
          <TimeSelector />
        </section>
        {/* ActionsMenu is for non-desktop only */}
        <section className="mb-auto mt-4 self-end md:hidden">
          <ActionsMenu />
        </section>
        {/* ChatRoom has threen variants, two for desktop and one for mobile */}
        <section className="flex basis-[23%] max-md:mb-4 max-md:max-h-[45%]">
          <Chat />
        </section>
        {/* ChatMobileBackground is absolute positioned background for mobile chat */}
        <ChatMobileBackground />
        {/* when user set mode=dredge-up on mobile, ChatHistoryMobile take the whole screen under ModeTabs */}
        <ChatHistoryMobile />
      </div>
    </>
  )
}

export default Home