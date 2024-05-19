import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Page = () => {
  return (
    <main className='flex size-full flex-col bg-dark'>
      <Link href="/" className='flex-center mx-6 mb-8 mt-auto h-[52px] rounded-[20px] bg-primary-dark'>Done</Link>
    </main>
  )
}

export default Page
