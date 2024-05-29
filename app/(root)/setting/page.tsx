'use client'

import { Button } from "@/components/ui/button"
import { SignOutButton, UserButton, useClerk } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import MobileNavigationBar from "@/components/shared/MobileNavigationBar"
import { useRouter } from 'next/navigation'

const Page = () => {
  const { session, openUserProfile } = useClerk()
  const router = useRouter()
  return (
    <div className='mx-6 mt-4 flex flex-col gap-4'>
      <MobileNavigationBar title="Settings" rootPath="/" />
      <section
        className="relative flex h-[96px] cursor-pointer items-center gap-4 rounded-[20px] bg-light px-3"
        onClick={() => openUserProfile()}
      >
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-[48px] w-[48px] rounded-full bg-primary-orange flex items-center justify-center',
            }
          }} />
        <Image src="/assets/icons/edit.svg" alt="Edit user profile" width={20} height={20} className="absolute bottom-[24px] left-[40px]" />
        <div className="flex flex-col justify-start gap-2">
          <span className="text-500-18-22">{session?.user.username}</span>
          <span className="text-400-14-17">{session?.user.emailAddresses[0].emailAddress}</span>
        </div>
      </section>

      <Link className="text-400-16-20 flex h-[52px] items-center justify-between rounded-[20px] bg-light px-3" href="/feedback">
        Send us feedback!
        <ChevronRight size={24} />
      </Link>

      <SignOutButton
        redirectUrl="/sign-in"
      >
        <Button className="h-[52px] cursor-pointer rounded-[20px] bg-light text-left text-[1rem] font-normal leading-[20px] text-[#EB3A3A]">Log out</Button>
      </SignOutButton>
    </div>
  )
}

export default Page
