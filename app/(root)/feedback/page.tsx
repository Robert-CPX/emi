"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import MobileNavigationBar from "@/components/shared/MobileNavigationBar"
import { createFeedback } from "@/lib/actions/feedback.actions"
import { getMongoUserByClerkId } from "@/lib/actions/user.actions"
import { useAuth } from '@clerk/clerk-react';
import { redirect } from 'next/navigation'
import { toast } from '@/components/ui/use-toast';

const FeedbackSchema = z.object({
  feedback: z.string().min(20, { message: "feedback must be at least 20 characters" }).max(2000),
})

const Page = () => {
  const { userId } = useAuth()
  if (!userId) redirect('/sign-in')

  const form = useForm<z.infer<typeof FeedbackSchema>>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      feedback: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof FeedbackSchema>) => {
    try {
      const user = await getMongoUserByClerkId({ userId })
      await createFeedback({ detail: values.feedback, author: user._id })
      form.reset()
      toast({ description: 'Answer posted successfully' })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="mx-4 mt-4 flex flex-col gap-4">
      <MobileNavigationBar title="feedback" allowBack />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="feedback"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-4">
                <FormLabel>Things you want to share with me!</FormLabel>
                <FormControl>
                  <Textarea placeholder="Add your comment..." {...field} className="grow basis-[360px] resize-none rounded-[28px]" />
                </FormControl>
                <FormMessage className="text-error" />
              </FormItem>
            )}
          />
          <Button type="submit" className="mb-8 rounded-[20px] bg-primary">Submit</Button>
        </form>
      </Form>
    </main>
  )
}

export default Page
