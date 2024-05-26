import React from 'react'

interface GoalSumupProps {
  title: string
}

const GoalSumup = (props: GoalSumupProps) => {
  const { title } = props
  return (
    <section className='orange-gradient-background text-400-14-17 -mx-8 flex h-[50px] shrink-0 items-center justify-center uppercase text-dark'>
      {title}
    </section>
  )
}

export default GoalSumup
