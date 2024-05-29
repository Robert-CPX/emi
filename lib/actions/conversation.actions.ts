'use server'
import { db } from "@/database/firebase";
import { collection, getDoc, setDoc, doc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { handleError } from "../utils";
import { CreateConversationParams } from "./shared";
import { getMongoUserByClerkId } from "./user.actions";
import Conversation from "@/database/models/conversation.model";

/**
 * @description init a conversation between emi and a user, there can only be one conversation
 * @param params userId
 * @returns conversation data stored in firestore
 */
export const getOrCreateConversation = async (params: CreateConversationParams) => {
  const { userId } = params;
  const user = await getMongoUserByClerkId({ userId });
  if (!user) throw new Error("User not found");

  try {
    const conversationsRef = collection(db, "conversations");
    const q = query(conversationsRef, where('participants', 'in', [["emi", user._id].sort()]));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Conversation;
    } else {
      const newConversationRef = doc(conversationsRef);
      const newConversationData: Conversation = {
        id: newConversationRef.id,
        participants: ["emi", user._id].sort(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await setDoc(newConversationRef, newConversationData);
      return newConversationData;
    }
  } catch (error) {
    handleError(error);
  }
}