import { User } from '@/database/models/user.model';
import { Goal } from '@/database/models/goal.model';

export type CreateUserParams = {
  clerkId: string;
  username: string;
  email: string;
  profilePic: string;
}

export type UpdateUserParams = {
  clerkId: string;
  updateData: Partial<User>;
  path: string; // For page revalidate purposes
}

export type DeleteUserParams = {
  clerkId: string;
}

export type CreateFeedbackParams = {
  author: string;
  detail: string;
  rating?: number;
  type?: string;
}

export type GetUserByIdParams = {
  userId: string;
}

export type HaveConversationParams = {
  content: string;
  userId: string;
}

export type SetTimerParams = {
  userId: string;
  time: number;
}

export type SetModeParams = {
  userId: string;
  mode: string;
}

export type CreateConversationParams = {
  userId: string;
}

export type SendMessageParams = {
  conversationId: string;
  sender: string;
  contentType: string;
  content: string;
  emotion?: {
    behavior: string;
    strong: string;
  };
}

export type GetMessagesParams = {
  conversationId: string;
}

export type CreateActivityParams = {
  type: string;
  value: number;
  userId: string;
  goalId: string;
}

export type UpdateActivityParams = {
  activityId: string;
}

export type CreateGoalParams = {
  title: string;
  description: string;
  duration: number;
  userId: string;
  isLongTerm: boolean;
  path: string; // For page revalidate purposes
}

export type UpdateGoalParams = {
  goalId: string;
  updateData: Partial<Goal>;
  path: string; // For page revalidate purposes
}

export type GetGoalsParams = {
  userId: string;
}

export type GetLatestGoalsParams = {
  userId: string;
  limit: number;
}

export type DeleteGoalParams = {
  goalId: string;
  path: string;
}

export type ArchiveGoalParams = {
  goalId: string;
  path?: string;
}

export type SimpleConversationParams = {
  text: string;
  endUserFullname: string;
  endUserId: string;
  conversationId?: string;
}