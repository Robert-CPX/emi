// Desc: Display chat history on mobile
'use client'

import React from "react";
import { useEmi } from "@/context/EmiProvider"
import { useEffect, useState } from "react"
import Image from "next/image";
import { getOrCreateConversation } from "@/lib/actions/conversation.actions";
import { fetchMessages } from "@/lib/actions/message.actions";
import { useAuth } from '@clerk/clerk-react';
import Message from "@/database/models/message.model";

const ChatHistoryMobile = () => {
  const { mode } = useEmi()
  const [chatHistory, setChatHistory] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState("")
  const { userId } = useAuth()

  useEffect(() => {
    if (!userId) return
    const initConversation = async () => {
      const conversation = await getOrCreateConversation({ userId })
      if (!conversation) return
      setConversationId(conversation.id)
    }
    initConversation()
  }, [userId]);

  useEffect(() => {
    if (mode !== 'dredge-up') return
    const updateMessages = async () => {
      const messages = await fetchMessages({ conversationId })
      if (!messages) return
      setChatHistory(messages)
    }
    updateMessages()
  }, [mode, conversationId])

  return (
    <section className={`absolute inset-0 flex size-full flex-col bg-light/80 backdrop-blur-md md:hidden ${mode === 'dredge-up' ? "flex" : "hidden"}`}>
      <div className="inset-x-0 h-20 w-full" />
      <div className="no-scrollbar flex size-full grow flex-col overflow-auto px-4">
        {chatHistory.map((message, index) => (
          <React.Fragment key={index}>
            {message.sender === 'emi' ? (
              <div className="flex items-start justify-start gap-1">
                <Image src="assets/images/emi_profile.svg" width={48} height={48} alt="avatar" className="my-2 size-[48px] rounded-full bg-[#D6DDFF]" />
                <div
                  className="chat-bubble-container-mobile-history chat-bubble-mobile-history-ai"
                >
                  <span className="chat-text text-dark">{message.content}</span>
                </div>
              </div>
            ) : (
              <div
                className="chat-bubble-container-mobile-history chat-bubble-mobile-history-user"
              >
                <span className="chat-text text-dark">{message.content}</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}

export default ChatHistoryMobile