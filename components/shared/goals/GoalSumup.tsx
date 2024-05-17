import React from 'react'

interface GoalSumupProps {
  title: string
}

const GoalSumup = (props: GoalSumupProps) => {
  const { title } = props
  return (
    <section className='goal-sum-up-background text-400-14-17 flex-center h-[50px] w-full rounded-[20px] uppercase text-dark'>
      {title}
    </section>
  )
}

export default GoalSumup
