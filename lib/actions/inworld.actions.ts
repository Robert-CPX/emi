'use server'

import { SimpleConversationParams } from './shared';
import { haveConversation } from './interaction.actions';
import { handleError } from '../utils';

export const simpleConversation = async (params: SimpleConversationParams) => {
  const my_key = "Basic " + process.env.INWORLD_BASE64_KEY
  const character = "workspaces/default-upyjqviok36wsxukslekpq/characters/emi2"
  const url = `https://api.inworld.ai/v1/${character}:simpleSendText`

  const { text, endUserFullname, endUserId, conversationId } = params
  if (!text) throw new Error("Text is required")
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': my_key,
      },
      body: JSON.stringify({
        character,
        text,
        sessionId: conversationId,
        endUserFullname,
        endUserId,
      }),
    })
    const { textList, emotion, sessionId, relationshipUpdate } = await response.json();
    const reply = textList.join('. ')
    // save user input to db
    await haveConversation({ content: text, userId: endUserId })
    return { reply, emotion, sessionId, relationshipUpdate }
  } catch (error) {
    throw handleError(error)
  }
}