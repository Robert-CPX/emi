import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Page = () => {
  return (
    <main className='flex size-full flex-col items-center justify-center bg-dark'>
      <div className='flex size-full flex-col sm:w-1/2'>
        <div className='flex-center z-10 mt-[150px] flex-col gap-6'>
          <h1 className='text-600-24-31 text-congrats-outline self-center font-lemon text-light'>Hey! It’s a small award</h1>
          <div className='relative mt-10 w-full'>
            <div className='absolute inset-0 mx-auto h-[348px] w-[264px] origin-bottom-right rotate-[5deg] rounded-[20px] bg-[#F3F2EF]/80' />
            <div className='award-card-background flex-center absolute inset-0 mx-auto h-[348px] w-[264px] flex-col gap-4 rounded-[20px] border-8 border-white p-6'>
              <Image src='/assets/images/pink_donut.svg' width={160} height={140} alt='pink donut' />
              <span className='text-600-24-30 text-white'>Pinky donut</span>
              <span className='text-400-16-20 text-center text-white'>You saw Emi was nibbling a pinky donut in the morning class break</span>
            </div>
          </div>
        </div>
        <Link href="/" className='flex-center mx-6 mb-8 mt-auto h-[52px] rounded-[20px] bg-primary-dark'>Done</Link>
      </div>
    </main>
  )
}

export default Page
