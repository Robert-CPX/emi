'use server'

import InteractionDocument from '@/database/models/interaction.model';
import { connectToDatabase } from '@/database/mongoose';
import { handleError } from '../utils';
import { HaveConversationParams, SetTimerParams, SetModeParams } from './shared';

// User have a conversation with Emi
export const haveConversation = async (params: HaveConversationParams) => {
  try {
    await connectToDatabase();
    const { content, userId } = params
    if (userId) {
      await InteractionDocument.create({
        clerkUserId: userId,
        question: content,
        action: 'conversation'
      })
    }
  } catch (error) {
    handleError(error)
  }
}

// User set a timer once
export const setANewTimer = async (params: SetTimerParams) => {
  try {
    await connectToDatabase();
    const { time, userId } = params
    if (userId) {
      await InteractionDocument.create({
        clerkUserId: userId,
        time: time,
        action: 'set_time'
      })
    }
  } catch (error) {
    handleError(error)
  }
}

// User set a mode once
export const toggleMode = async (params: SetModeParams) => {
  try {
    await connectToDatabase();
    const { mode, userId } = params
    if (userId) {
      await InteractionDocument.create({
        clerkUserId: userId,
        mode: mode,
        action: 'set_mode'
      })
    }
  } catch (error) {
    handleError(error)
  }
}