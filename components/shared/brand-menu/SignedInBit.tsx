'use client'

import { DropdownMenuContent, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { SignOutButton, SignedIn, UserButton, useClerk } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

const SignedInBit = () => {
  const { session, openUserProfile, signOut } = useClerk()
  return (
    <SignedIn>
      <DropdownMenuContent className="ml-8 mt-3 w-[288px] rounded-[20px] border border-dark bg-light">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => openUserProfile()}
            className="flex cursor-pointer items-center gap-4"
          >
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-[48px] w-[48px] rounded-full bg-primary-orange flex items-center justify-center',
                }
              }} />
            <Image src="/assets/icons/edit.svg" alt="Edit user profile" width={20} height={20} className="absolute bottom-[6px] left-[38px]" />
            <div className="flex flex-col justify-start gap-2">
              <span className="text-500-18-22">{session?.user.username}</span>
              <span className="text-400-14-17 overflow-hidden text-ellipsis">{session?.user.emailAddresses[0].emailAddress}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="separator" />
          <DropdownMenuItem className="h-[52px] cursor-pointer text-[1rem] font-normal leading-[20px]">
            <Link href="/feedback">Send us feedback!</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="separator" />
          <SignOutButton
            redirectUrl="/sign-in"
          >
            <DropdownMenuItem className="h-[52px] cursor-pointer text-[1rem] font-normal leading-[20px] text-[#EB3A3A]">
              Log out
            </DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </SignedIn>
  )
}

export default SignedInBit
