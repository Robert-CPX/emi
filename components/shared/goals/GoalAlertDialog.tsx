'use client'

import React, { useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deleteGoal, archiveGoal } from '@/lib/actions/goal.actions';
import { toast } from '@/components/ui/use-toast';

const GoalAlertDialog = () => {
  const searchParams = useSearchParams();
  const deleteGoalId = searchParams.get("delete");
  const archiveGoalId = searchParams.get("archive");
  const pathname = usePathname()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirmAction = async () => {
    setIsSubmitting(true)
    try {
      if (deleteGoalId) {
        await deleteGoal({ goalId: deleteGoalId, path: pathname });
      } else if (archiveGoalId) {
        await archiveGoal({ goalId: archiveGoalId, path: pathname });
      }
      router.push(pathname)
      const description = deleteGoalId ? 'Goal deleted successfully' : 'You archived the goal successfully'
      toast({ description })
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {(deleteGoalId || archiveGoalId) && (
        <dialog className='dialog-background'>
          <div className="flex-center mx-6 w-full flex-col gap-6 rounded-[20px] bg-light px-6 py-14">
            <span>
              {deleteGoalId ?
                "Are you sure you want to delete your goal?" :
                "Have you successfully achieved this goal?"
              }
            </span>
            <div className='flex w-full items-center justify-between text-dark'>
              <Button
                onClick={() => router.push(pathname)}
                className='h-[40px] w-[148px] rounded-[20px] border border-dark bg-light'>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAction}
                className='h-[40px] w-[148px] rounded-[20px] bg-primary'
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    {deleteGoalId ? 'Deleting...' : 'Archiving...'}
                  </>
                ) : (
                  <>
                    {deleteGoalId ? 'Yes, delete' : 'Yes'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </>
  )
}

export default GoalAlertDialog
