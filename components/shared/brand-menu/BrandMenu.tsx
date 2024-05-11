'use client'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs"
import { Loader2, ChevronUp, ChevronDown } from "lucide-react"
import SignedInBit from "./SignedInBit"
import { useEmi } from "@/context/EmiProvider"
import { useState } from "react"

const BrandMenu = () => {
  const { mode } = useEmi()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      {mode === 'companion' ? (
        <div className="self-start rounded-[20px] border border-dark bg-light shadow-md max-md:hidden">
          <ClerkLoading>
            <Loader2 size={48} className="size-12 animate-spin text-dark" />
          </ClerkLoading>
          <ClerkLoaded>
            <DropdownMenu
              onOpenChange={(open) => setIsOpen(open)}
            >
              <DropdownMenuTrigger asChild>
                <Button className="h-[48px] w-[198px] gap-2 font-lemon text-[1.25rem] font-normal leading-[26px] focus-visible:ring-0 focus-visible:ring-offset-0">
                  StudyCafe
                  {isOpen ? <ChevronDown /> : <ChevronUp />}
                </Button>
              </DropdownMenuTrigger>
              <SignedInBit />
            </DropdownMenu>
          </ClerkLoaded>
        </div>
      ) : (
        // an invisible element to keep the layout consistent
        <div className="h-[48px] w-[215px] max-md:hidden" />
      )}

    </>
  )
}

export default BrandMenu
