// Desc: Display chat history on mobile
'use client'

import React from "react";
import { useMeimei } from "@/context/MeimeiProvider"
import { useEffect, useState } from "react"
import { ChatResponse } from "../../../constants"
import { MockChatHistory } from "@/constants/constants"
import Image from "next/image";

const ChatHistoryMobile = () => {
  const { mode } = useMeimei()
  const [chatHistory, setChatHistory] = useState<ChatResponse[]>([])

  useEffect(() => {
    setChatHistory(MockChatHistory)
  }, [])

  return (
    <section className={`absolute inset-0 flex size-full flex-col bg-light/80 backdrop-blur-md md:hidden ${mode === 'dredge-up' ? "flex" : "hidden"}`}>
      <div className="inset-x-0 h-20 w-full" />
      <div className="no-scrollbar flex size-full grow flex-col overflow-auto px-4">
        {chatHistory.map((message, index) => (
          <React.Fragment key={index}>
            {message.role !== 'user' && (
              <div className="flex items-start justify-start gap-1">
                <Image src="assets/images/meimei_profile.svg" width={48} height={48} alt="avatar" className="my-2 size-[48px] rounded-full bg-[#D6DDFF]" />
                <div
                  className="chat-bubble-container-mobile-history chat-bubble-mobile-history-ai"
                >
                  <span className="chat-text text-dark">{message.content}</span>
                </div>
              </div>

            )}
            <div
              className="chat-bubble-container-mobile-history chat-bubble-mobile-history-user"
            >
              <span className="chat-text text-dark">{message.content}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}

export default ChatHistoryMobile