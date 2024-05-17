'use client'
import Link from "next/link";
import { X, ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation'
import { Button } from "../ui/button";

type MobileNavigationBarProps = {
  title: string;
  rootPath?: string;
  allowBack?: boolean;
}

const MobileNavigationBar = ({
  title, rootPath, allowBack
}: MobileNavigationBarProps) => {

  const router = useRouter()

  return (
    <section className="background-dark_light flex h-12 items-center justify-between md:hidden">
      {allowBack ? (
        <Button
          size="icon"
          onClick={() => router.back()}
          className="text-dark_light flex size-12 items-center justify-center"
        >
          <ChevronLeft />
        </Button>
      ) : (
        <div className="size-10" />
      )}
      <p className="mobile-nav-title text-dark_light mx-auto">{title}</p>
      {rootPath ? (
        <Link href={rootPath} className="text-dark_light flex size-12 items-center justify-center">
          <X />
        </Link>
      ) : (
        <div className="size-10" />
      )}
    </section>
  )
}

export default MobileNavigationBar
