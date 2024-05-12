'use server'
import { db } from "@/database/firebase";
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { handleError } from "../utils";
import { SendMessageParams, GetMessagesParams } from "./shared";
import Message from "@/database/models/message.model";

export const saveMessages = async (params: SendMessageParams) => {
  const { conversationId } = params;
  try {
    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const newMessage: Message = {
      ...params,
      createdAt: Date.now(),
    }
    const messageDocRef = await addDoc(messagesRef, newMessage);
    newMessage.id = messageDocRef.id;

    await updateDoc(doc(db, "conversations", conversationId), {
      updatedAt: Date.now(),
      lastMessage: newMessage,
    });
    return newMessage;
  } catch (error) {
    handleError(error);
  }
}

export const fetchMessages = async (params: GetMessagesParams) => {
  const { conversationId } = params;
  try {
    const messagesQuery = query(collection(db, 'conversations', conversationId, 'messages'), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(messagesQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Message);
  } catch (error) {
    handleError(error);
  }
}