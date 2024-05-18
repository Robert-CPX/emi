// a welcome page for new user, with a video background.
// after user signedout, or direct to this page without login in state, it won't redirect to the home page.
'use client'

import { useEffect } from "react"
import { useRouter } from 'next/navigation'
import { SignedOut } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@clerk/nextjs"

const Page = () => {
  const router = useRouter()
  const { userId } = useAuth()
  useEffect(() => {
    if (!userId) return;
    const redirectTimeout = setTimeout(() => {
      router.push("/");
    }, 15000);
    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      };
    };
  }, [router, userId]);

  return (
    <div className="relative flex size-full">
      <div className="emi-main">
        <video
          autoPlay muted playsInline loop
          className="size-full object-cover"
        >
          <source src="assets/videos/onboarding.mp4" type="video/mp4" />
        </video>
      </div>
      {!userId && (
        <div className="absolute inset-x-0 bottom-20 mx-auto w-2/5 lg:w-[280px]">
          <SignedOut>
            <Link href="/sign-in">
              <Button className="h-[48px] w-full cursor-pointer rounded-md bg-primary text-light">
                <span className='text-[1.25rem] font-normal uppercase leading-[26px]'>Log In</span>
              </Button>
            </Link>
          </SignedOut>
        </div>
      )}

    </div>
  );
};

export default Page
