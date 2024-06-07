'use client'
import Emi from "@/components/shared/Emi"
import ModeTabs from "@/components/shared/ModeTabs"
import BrandMenu from "@/components/shared/brand-menu"
import { GoalMenu, GoalsContentWrapper } from "@/components/shared/goals"
import { Chat, ChatMobileBackground, ChatHistoryMobile } from "@/components/shared/chat"
import ActionsMenu from "@/components/shared/ActionsMenu"
import { TimeEditor, TimeSelector } from "@/components/shared/timer"
import { redirect } from 'next/navigation'
import { useAuth } from '@clerk/clerk-react';
import { useEmi } from "@/context/EmiProvider"
import { useEffect, useState } from "react"
import { checkUnarchivedGoalExist } from "@/lib/actions/goal.actions"
import { getMongoUserByClerkId, updateUser } from "@/lib/actions/user.actions"
import { NEW_USER } from "@/constants/constants"
import { isOver24Hours } from "@/lib/utils"

const Home = () => {
  const { userId } = useAuth()
  if (!userId) redirect('/sign-in')
  const [unarchivedGoalExist, setUnarchivedGoalExist] = useState(false)
  const [isTodayFirstEnter, setIsTodayFirstEnter] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  const { mode } = useEmi()

  useEffect(() => {
    setIsNewUser(sessionStorage.getItem(NEW_USER) === 'true')
    const updateInfo = async () => {
      try {
        const [user, isExist] = await Promise.all([
          getMongoUserByClerkId({ userId }),
          checkUnarchivedGoalExist({ userId })
        ]);
        setUnarchivedGoalExist(isExist);
        if (user.lastActiveAt) {
          setIsTodayFirstEnter(isOver24Hours(user.lastActiveAt))
        }
        await updateUser({
          clerkId: userId,
          updateData: {
            lastActiveAt: new Date(),
          },
        });
        console.log("user loginedddddddd")
      } catch (error) {
        // Handle error here
      }
    }
    updateInfo()
  }, [userId])

  useEffect(() => {
    if (mode === 'cheer') {
      redirect("/cheer")
    }
  }, [mode])

  return (
    <>
      {/* Emi as background */}
      <div className="emi-main">
        <Emi isNewUser={isNewUser} isTodayFirstEnter={isTodayFirstEnter} />
      </div>
      <div className="isolate flex h-full justify-between p-4 max-md:flex-col md:px-8">
        {/* Brand & GoalsContentWrapper menu only show on desktop */}
        <section className="flex flex-col items-start justify-start gap-4">
          <BrandMenu />
          <GoalsContentWrapper />
        </section>
        {/* this section is on top */}
        <section className="z-10 flex flex-col items-center justify-start gap-4">
          {/* Mode Tabs disappear only when timer is running */}
          <ModeTabs />
          {(mode === 'companion' && unarchivedGoalExist) && (
            <GoalMenu container="home" />
          )}
          {/* Time Editor only show on desktop */}
          <TimeEditor unarchivedGoalExist={unarchivedGoalExist} />
          {/* Time Selector only show on mobile */}
          <TimeSelector unarchivedGoalExist={unarchivedGoalExist} />
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