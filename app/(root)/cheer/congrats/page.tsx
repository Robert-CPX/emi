import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Page = () => {
  return (
    <main className='flex size-full flex-col bg-dark'>
      <Image src="/assets/images/star_1.svg" width={120} height={120} alt="star" className="object-contain" />
      <Image src="/assets/images/star_2.svg" width={169} height={169} alt="star" className="self-end object-contain" />
      <Image src="/assets/images/star_3.svg" width={120} height={120} alt="star" className="object-contain" />
      <Link href="/cheer/congrats/awards" className='flex-center mx-6 mb-8 mt-auto h-[52px] rounded-[20px] bg-primary-dark'>Yay!</Link>
    </main>
  )
}

export default Page
