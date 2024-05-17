'use client'

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"

import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EditGoalSchema } from '@/lib/validation'
import { createGoal } from '@/lib/actions/goal.actions'
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import Link from "next/link";

type GoalFormProps = {
  clerkId: string;
}

const GoalForm = ({
  clerkId
}: GoalFormProps) => {

  const searchParams = useSearchParams();
  const newGoal = searchParams.get("addNewGoal");
  const pathname = usePathname()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof EditGoalSchema>>({
    resolver: zodResolver(EditGoalSchema)
  })

  const onSubmit = async (values: z.infer<typeof EditGoalSchema>) => {
    setIsSubmitting(true)
    const isLongTerm = newGoal === 'longterm'
    try {
      await createGoal({ title: values.title, description: values.description, duration: 0, userId: clerkId, path: pathname, isLongTerm })
      router.push(pathname)
      toast({ description: 'A new goal added successfully' })
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {(newGoal === 'todo' || newGoal === 'longterm') &&
        <dialog className='fixed left-0 top-0 z-50 flex size-full items-center justify-center overflow-auto bg-dark/50'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mx-6 flex w-full flex-col gap-4 rounded-[20px] bg-light px-4 py-5">
              <FormField
                control={form.control}
                name="title"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-400-16-20 ml-4">Your goal</FormLabel>
                    <FormControl>
                      <Input placeholder='set a goal' className="no-focus h-[50px] rounded-[28px] border border-dark bg-light px-5 py-4" {...field} />
                    </FormControl>
                    <FormMessage className="text-error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-400-16-20 ml-4">Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder='add some description' className="no-focus h-[100px] rounded-[28px] border border-dark bg-light px-5 py-4" {...field} />
                    </FormControl>
                    <FormMessage className="text-error" />
                  </FormItem>
                )}
              />
              <div className='flex items-center justify-between'>
                <Link href={pathname}>
                  <Button type="button" className='h-[40px] w-[148px] rounded-[20px] border border-dark text-dark'>Cancel</Button>
                </Link>
                <Button type="submit" className='h-[40px] w-[148px] rounded-[20px] bg-primary text-dark' disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      {'Adding...'}
                    </>
                  ) : (
                    <>
                      {'Add'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </dialog>
      }
    </>
  )
}

export default GoalForm
