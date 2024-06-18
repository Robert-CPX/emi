'use client'

import React, { useEffect, useState } from 'react';
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
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import Link from "next/link";
import { createGoal, getGoalById, updateGoal } from '@/lib/actions/goal.actions';
import { useEmi } from '@/context/EmiProvider';

type GoalFormProps = {
  clerkId: string;
}

const GoalForm = ({
  clerkId
}: GoalFormProps) => {

  const searchParams = useSearchParams();
  const addGoal = searchParams.get("add");
  const editGoal = searchParams.get("edit");
  const pathname = usePathname()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const { setGoalCreated: setEmiGoalCreated } = useEmi();

  const form = useForm<z.infer<typeof EditGoalSchema>>({
    resolver: zodResolver(EditGoalSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  })

  useEffect(() => {
    if (editGoal) {
      const fetchGoal = async () => {
        const { goal } = await getGoalById(editGoal)
        form.setValue('title', goal.title)
        form.setValue('description', goal.description)
      }
      fetchGoal()
    }
  }, [editGoal, form])

  const onSubmit = async (values: z.infer<typeof EditGoalSchema>) => {
    setIsSubmitting(true)
    const isLongTerm = addGoal === 'longterm'
    try {
      if (editGoal) {
        await updateGoal({ goalId: editGoal, updateData: { title: values.title, description: values.description }, path: pathname })
      } else {
        await createGoal({ title: values.title, description: values.description, duration: 0, userId: clerkId, path: pathname, isLongTerm })
      }
      router.push(pathname)
      setEmiGoalCreated(true);
      const description = editGoal ? 'Goal updated successfully' : 'A new goal added successfully'
      toast({ description })
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
      form.setValue('title', "")
      form.setValue('description', "")
    }

  }

  return (
    <>
      {(addGoal === 'todo' ||
        addGoal === 'longterm' ||
        editGoal) &&
        <dialog className='dialog-background'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mx-6 flex flex-col gap-4 rounded-[20px] bg-light px-4 py-5">
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
              <div className='flex items-center justify-between gap-3'>
                <Link href={pathname}>
                  <Button type="button" className='h-[40px] w-[148px] rounded-[20px] border border-dark text-dark'>Cancel</Button>
                </Link>
                <Button type="submit" className='h-[40px] w-[148px] rounded-[20px] bg-primary text-dark' disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      {editGoal ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      {editGoal ? 'Update' : 'Add'}
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
