import * as z from "zod"
import { GoalStatus } from "@/database/models/goal.model";
import { ObjectId } from 'mongoose'

export const GoalSchema = z.object({
  _id: z.coerce.string(),
  title: z.string().min(8).max(120),
  description: z.string().min(8).max(400),
  icing: z.string().optional(),
  duration: z.number().optional(),
  activities: z.array(z.custom<ObjectId>()).optional(),
  isLongTerm: z.boolean(),
  status: z.custom<GoalStatus>(),
  createdAt: z.custom<Date>(),
  updatedAt: z.custom<Date>(),
  creator: z.custom<ObjectId>(),
});

export const AllGoalsSchema = z.array(
  z.object({
    isLongTerm: z.boolean(),
    goals: z.array(GoalSchema),
  })
)

export const EditGoalSchema = z.object({
  title: z.string().min(8).max(120),
  description: z.string().min(8).max(400),
})