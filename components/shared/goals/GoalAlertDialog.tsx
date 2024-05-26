'use client'

import React, { useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deleteGoal, archiveGoal } from '@/lib/actions/goal.actions';
import { toast } from '@/components/ui/use-toast';
import Confetti from 'react-confetti'

const GoalAlertDialog = () => {
  const searchParams = useSearchParams();
  const deleteGoalId = searchParams.get("delete");
  const archiveGoalId = searchParams.get("archive");
  const pathname = usePathname()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExplosion, setIsExplosion] = useState(false)

  const handleConfirmAction = async () => {
    setIsSubmitting(true)
    try {
      if (deleteGoalId) {
        await deleteGoal({ goalId: deleteGoalId, path: pathname });
        router.push(pathname);
        toast({ description: 'Goal deleted successfully' })
      } else if (archiveGoalId) {
        await archiveGoal({ goalId: archiveGoalId, path: pathname });
        setIsExplosion(true)
        setTimeout(() => {
          router.push(pathname);
          setIsExplosion(false)
        }, 3000);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {(deleteGoalId || archiveGoalId) && (
        <dialog className="dialog-background">
          <div className={`flex-center mx-6 flex-col gap-6 rounded-[20px] bg-light px-6 py-14 ${isExplosion && "opacity-0"}`}>
            <span>
              {deleteGoalId ?
                "Are you sure you want to delete your goal?" :
                "Have you successfully achieved this goal?"
              }
            </span>
            <div className='flex w-full items-center justify-between gap-3 text-dark'>
              <Button
                onClick={() => router.push(pathname)}
                className='h-[40px] flex-1 rounded-[20px] border border-dark bg-light'>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAction}
                className='h-[40px] flex-1 rounded-[20px] bg-primary'
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
          {isExplosion && <Confetti width={window.innerWidth} height={window.innerHeight} />}
        </dialog>
      )}
    </>
  )
}

export default GoalAlertDialog
