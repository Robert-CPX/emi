'use server'
import GoalDocument from '@/database/models/goal.model';
import ActivityDocument from '@/database/models/activity.model';
import { connectToDatabase } from '@/database/mongoose';
import { handleError } from '../utils';
import { CreateGoalParams, UpdateGoalParams, GetGoalsParams, DeleteGoalParams, ArchiveGoalParams } from './shared';
import { getMongoUserByClerkId } from './user.actions';
import { GoalSchema, AllGoalsSchema } from '../validation';
import { revalidatePath } from "next/cache"

export const createGoal = async (params: CreateGoalParams) => {
  try {
    await connectToDatabase();
    const { title, description, icing = "", duration, isLongTerm, userId, path } = params;
    const user = await getMongoUserByClerkId({ userId });
    if (!user) throw new Error("User not found");
    const newGoal = await GoalDocument.create(
      { title, description, icing, duration, creator: user._id, isLongTerm }
    );
    revalidatePath(path);
    return newGoal;
  } catch (error) {
    handleError(error);
  }
}

export const getGoalById = async (goalId: string) => {
  try {
    await connectToDatabase();
    const goal = await GoalDocument.findById(goalId);
    const parsedGoal = GoalSchema.safeParse(goal);
    if (!parsedGoal.success) throw new Error("Failed to parse goal");
    return parsedGoal.data;
  } catch (error) {
    throw handleError(error);
  }
}

export const updateGoal = async (params: UpdateGoalParams) => {
  try {
    await connectToDatabase();
    const { goalId, updateData, path } = params;
    await GoalDocument.findByIdAndUpdate(
      goalId,
      updateData
    )
    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

//TODO: need to confirm filter logic
export const getGoals = async (params: GetGoalsParams) => {
  try {
    await connectToDatabase();
    const { userId } = params;
    const user = await getMongoUserByClerkId({ userId });
    if (!user) throw new Error("User not found");

    const goals = await GoalDocument.aggregate([
      {
        $match: { creator: user._id, status: { $ne: "ARCHIVED" } }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: "$isLongTerm",
          goals: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          isLongTerm: "$_id",
          goals: 1,
          _id: 0
        }
      }
    ]);
    const parsedGoals = AllGoalsSchema.safeParse(goals);
    if (!parsedGoals.success) throw new Error("Failed to parse goals");
    const todos = parsedGoals.data.find((goal) => !goal.isLongTerm);
    const longTerms = parsedGoals.data.find((goal) => goal.isLongTerm);
    return { todos: todos?.goals ?? [], longTerms: longTerms?.goals ?? [] };
  } catch (error) {
    throw handleError(error);
  }
}

export const checkArchiveGoalsExist = async (params: GetGoalsParams) => {
  try {
    await connectToDatabase();
    const { userId } = params;
    const user = await getMongoUserByClerkId({ userId });
    if (!user) throw new Error("User not found");

    const goals = await GoalDocument.find({ creator: user._id, status: "ARCHIVED" });
    return goals.length > 0;
  } catch (error) {
    throw handleError(error);
  }
}

export const getArchivedGoals = async (params: GetGoalsParams) => {
  try {
    await connectToDatabase();
    const { userId } = params;
    const user = await getMongoUserByClerkId({ userId });
    if (!user) throw new Error("User not found");

    const goals = await GoalDocument.aggregate([
      {
        $match: { creator: user._id, status: "ARCHIVED" }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: "$isLongTerm",
          goals: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          isLongTerm: "$_id",
          goals: 1,
          _id: 0
        }
      }
    ]);
    const parsedGoals = AllGoalsSchema.safeParse(goals);
    if (!parsedGoals.success) throw new Error("Failed to parse goals");
    const todos = parsedGoals.data.find((goal) => !goal.isLongTerm);
    const longTerms = parsedGoals.data.find((goal) => goal.isLongTerm);
    return { archivedTodos: todos?.goals ?? [], archivedLongTerms: longTerms?.goals ?? [] };
  } catch (error) {
    throw handleError(error);
  }
}

// delete a goal and all related activities
export const deleteGoal = async (params: DeleteGoalParams) => {
  try {
    await connectToDatabase();
    const { goalId, path } = params;
    const deletedGoal = await GoalDocument.findOneAndDelete({ _id: goalId });
    await ActivityDocument.deleteMany({ goal: deletedGoal._id });
    revalidatePath(path);
  } catch (error) {
    throw handleError(error);
  }
}

export const archiveGoal = async (params: ArchiveGoalParams) => {
  try {
    await connectToDatabase();
    const { goalId, path } = params;
    await GoalDocument.findByIdAndUpdate(
      goalId,
      { status: "ARCHIVED" }
    )
    revalidatePath(path);
  } catch (error) {
    throw handleError(error);
  }
}