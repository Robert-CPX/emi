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

    return newActivity._id;
  } catch (error) {
    throw handleError(error);
  }
}

// cancel an activity, also remove it from the related goal
export const cancelActivity = async (activityId: string) => {
  try {
    await connectToDatabase();
    const activity = await ActivityDocument.findByIdAndDelete(activityId);
    if (!activity) throw new Error("Activity not found");
    // Find and update the goal
    await GoalDocument.findByIdAndUpdate(activity.goalId, {
      $pull: { activities: activityId },
      updatedAt: new Date(),
      status: GoalStatus.InProgress
    })
  } catch (error) {
    throw handleError(error);
  }
}