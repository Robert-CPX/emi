"use client"
import {
  Character,
  HistoryItem,
  InworldConnectionService,
} from '@inworld/web-core';

import { useCallback, useEffect, useState } from "react";
import InputControl from "./InputControl";
import ChatHistoryWidget from "./ChatHistoryWidget";
import { useEmi } from "@/context/EmiProvider";
import SingleChatBox from "./SingleChatBox";
import MiniChatBubble from "./MiniChatBubble";
import { useEmiTime } from "@/context/EmiTimeProvider";
import { EmotionsMap } from "@/constants";
import { useAuth } from '@clerk/nextjs'
import { getOrCreateConversation } from '@/lib/actions/conversation.actions';
import { saveMessages } from '@/lib/actions/message.actions';

interface ChatRoomProps {
  characters: Character[];
  chatHistory: HistoryItem[];
  connection: InworldConnectionService;
  emotions: EmotionsMap;
  lastMessages: string;
}

const ChatRoom = (props: ChatRoomProps) => {
  const { characters, chatHistory, connection, lastMessages } = props;
  const [text, setText] = useState("");
  const [isInteractionEnd, setIsInteractionEnd] = useState<boolean>(false);
  const { mode } = useEmi()
  const [isSneaking, setIsSneaking] = useState(false) // a flag to show/hide ChatHistory on desktop
  const { isRunning } = useEmiTime()
  const [currentConversationId, setCurrentConversationId] = useState<string>('');
  const { userId } = useAuth()

  const saveConversation = useCallback(async (role: "user" | "emi", content: string) => {
    if (!currentConversationId || !userId) return
    const message = {
      sender: role === "user" ? userId : "emi",
      content,
      contentType: "text",
    }
    await saveMessages({ conversationId: currentConversationId, ...message })
  }, [currentConversationId, userId]);

  const handleTextSend = useCallback((input: string) => {
    connection.sendText(input)
    saveConversation("user", input)
    setText("")
  }, [connection, saveConversation])

  const handleUserClickMiniChatBubble = () => {
    setIsSneaking(!isSneaking)
  }

  const handleInteractionEnd = useCallback((interactionEnd: boolean, content: string) => {
    setIsInteractionEnd(interactionEnd)
    if (interactionEnd && content.length) {
      saveConversation("emi", content)
    }
  }, [saveConversation])

  useEffect(() => {
    // reset chat history's UI when mode changes
    setIsSneaking(false)
  }, [mode])

  useEffect(() => {
    if (!userId) return
    const initConversation = async () => {
      const conversation = await getOrCreateConversation({ userId })
      if (!conversation) return
      setCurrentConversationId(conversation.id)
    }
    initConversation()
  }, [userId]);

  return (
    <>
      {!isRunning || isSneaking ? (
        <section className="chat-container">
          <div className="no-scrollbar flex flex-col overflow-y-auto overscroll-contain md:grow">
            <ChatHistoryWidget
              history={chatHistory}
              characters={characters}
              emotions={props.emotions}
              onInteractionEnd={handleInteractionEnd}
            />
          </div>
          <InputControl
            text={text}
            setText={setText}
            handleTextSend={handleTextSend}
          />
        </section>
      ) : (
        <div className="flex w-full flex-col items-end gap-3 max-md:hidden">
          <SingleChatBox text={lastMessages} />
          <MiniChatBubble handleAction={handleUserClickMiniChatBubble} />
        </div>
      )}
    </>
  )
}

export default ChatRoom
