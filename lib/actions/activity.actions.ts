'use server'
import ActivityDocument from '@/database/models/activity.model';
import GoalDocument, { GoalStatus } from '@/database/models/goal.model';
import { connectToDatabase } from '@/database/mongoose';
import { handleError } from '../utils';
import { CreateActivityParams } from './shared';
import { getMongoUserByClerkId } from './user.actions';

// create a new activity, also update the related goal
export const createActivity = async (params: CreateActivityParams) => {
  try {
    await connectToDatabase();
    const { type, value, userId, goalId } = params;
    const user = await getMongoUserByClerkId({ userId });
    if (!user) throw new Error("User not found");
    const newActivity = await ActivityDocument.create(
      { type, value, creator: user._id, goalId }
    );
    // Find and update the goal
    await GoalDocument.findByIdAndUpdate(goalId, {
      $push: { activities: newActivity._id },
      updatedAt: new Date(),
      status: GoalStatus.InProgress
    })

    return newActivity;
  } catch (error) {
    handleError(error);
  }
}