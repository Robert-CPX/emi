// a welcome page for new user, with a video background.
// after user signedout, or direct to this page without login in state, it won't redirect to the home page.
'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter } from 'next/navigation'
import { SignedIn } from "@clerk/nextjs"
import Link from "next/link";

const Page = () => {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showEntry, setShowEntry] = useState(false)

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      router.push("/");
    }, 43000);

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      };
    };
  }, [router]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.play();
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowEntry(true)
    }, 3000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="relative flex size-full">
      <div className="emi-main">
        <video
          ref={videoRef}
          muted
          className="size-full object-cover"
        >
          <source src="assets/videos/onboarding.mp4" type="video/mp4" />
        </video>
      </div>
      {showEntry && (
        <SignedIn>
          <Link href="/" className="flex-center mx-auto mb-10 mt-auto h-[48px] w-[240px] cursor-pointer rounded-md bg-primary/85 text-light">
            <span className='text-[1.25rem] font-normal leading-[26px]'>Enter</span>
          </Link>
        </SignedIn>
      )}
    </div>
  );
};

export default Page
