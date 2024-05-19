import { Actor, EmotionEvent, HistoryItem, HistoryItemActor, HistoryItemNarratedAction, HistoryItemTriggerEvent, CHAT_HISTORY_TYPE } from '@inworld/web-core';
import { ObjectId } from 'mongoose'

// https://docs.inworld.ai/docs/tutorial-basics/personality-emotion/
export type EmiBehavior = "AFFECTION" | "ANGER" | "BELLIGERENCE" | "CONTEMPT" | "CRITICISM" | "DEFENSIVENESS" | "DISGUST" | "DOMINEERING" | "HUMOR" | "INTEREST" | "JOY" | "SADNESS" | "STONEWALLING" | "SURPRISE" | "TENSE" | "TENSION" | "VALIDATION" | "WHINING";

export type EmiEmotion = {
  behavior: EmiBehavior;
  strength: string;
}

export type TabDataType = {
  name: string;
  value: string;
}[]

export type EmotionsMap = {
  [key: string]: EmotionEvent;
}

export type CombinedHistoryItem = {
  interactionId: string;
  messages: (
    | HistoryItemActor
    | HistoryItemNarratedAction
    | HistoryItemTriggerEvent
  )[];
  source: Actor;
  type: CHAT_HISTORY_TYPE;
};

export type Goal = {
  _id: string;
  title: string;
  description: string;
  _icing?: string;
  status: string;
  activities?: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};