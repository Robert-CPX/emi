import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getGoalById } from '@/lib/actions/goal.actions'
import { formatGoalDurationTime } from '@/lib/utils'

const Page = async ({
  searchParams
}: {
  searchParams: {
    [key: string]: string | undefined
  }
}) => {
  const status = searchParams.status as string
  const goalId = searchParams.goalId as string
  const { goal } = await getGoalById(goalId)

  return (
    <main className='size-full bg-dark'>
      <div className={`absolute size-full ${status === 'inprogress' && "hidden"}`}>
        <Image src="/assets/images/star_1.svg" width={120} height={120} alt="star" className='mt-[98px]' />
        <Image src="/assets/images/star_2.svg" width={169} height={169} alt="star" className='ml-auto mr-0' />
        <Image src="/assets/images/star_3.svg" width={120} height={120} alt="star" />
      </div>
      <div className='isolate flex size-full flex-col'>
        <div className='flex-center mt-[150px] flex-col gap-6'>
          <h1 className='text-600-24-31 text-congrats-outline self-center font-lemon text-light'>{status === 'done' ? "Congratulations!" : "Cool!"}</h1>
          <div className='flex-center flex-col gap-1'>
            <span
              className='text-400-16-20 text-center text-light'>
              {`${status === 'done' ? "You have conquered the calculus review" : "You have a step closer to your goal"}`}
            </span>
            <span className='text-400-16-20 text-center text-light'>by focusing for</span>
          </div>
          <span
            className='text-200-48-60 bg-transparent bg-gradient-to-r from-[#D443BA] via-[#FFBE12] to-[#86C4D2] bg-clip-text text-transparent'
          >
            {formatGoalDurationTime(goal.duration)}
          </span>
          <Image
            src={`/assets/images/${status === "done" ? "emi_congrats_done" : "emi_congrats_inprogress"}.png`}
            width={230}
            height={268}
            alt='emi congrats done'
            className='mt-24 object-contain'
          />
        </div>
        <Link
          href={status === "done" ? "congrats/awards" : "/"}
          className='flex-center mx-6 mb-8 mt-auto h-[52px] rounded-[20px] bg-primary-dark'>{status === "done" ? "Yay!" : "Done"}
        </Link>
      </div>
    </main>
  )
}

export default Page
