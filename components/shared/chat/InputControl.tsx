"use client"

import { FormEvent, useEffect, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { Button } from "@/components/ui/button"

import { playSound } from "@/lib/utils"
import { AUDIO_RESOURCES } from "@/constants/constants"

type InputControlProps = {
  text: string;
  setText: (text: string) => void;
  handleTextSend: (text: string) => void;
}

const InputControl = ({
  text,
  setText,
  handleTextSend
}: InputControlProps) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!text.trim()) return
    playSound(AUDIO_RESOURCES.MESSAGE_SOUND)
    handleTextSend(text)
    setText("")
  }

  const onEnter = useCallback((event: KeyboardEvent) => {
    let trimmedText = text.trim()
    if (!trimmedText) return
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      playSound(AUDIO_RESOURCES.MESSAGE_SOUND)
      handleTextSend(trimmedText)
      setText("")
    }
  }, [text, setText, handleTextSend])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "48px"
    textarea.style.height = `${textarea.scrollHeight}px`

    textarea.addEventListener("keydown", onEnter)
    return () => {
      textarea.removeEventListener("keydown", onEnter)
    }
  }, [text, onEnter])

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <span className={`text-500-10-12 mb-1 mr-3 self-end ${text.length >= 100 ? 'text-error' : 'text-[hsla(0,0%,82%,1)]'}`}>{`${text.length}/100`}</span>
      <div className="relative grow">
        <Textarea
          ref={textareaRef}
          maxLength={100}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tell me about you today!"
          className="chat-textarea focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button disabled={!text.trim()} className="absolute bottom-1 right-0">
          <Image src="/assets/icons/send.svg" alt="send" width={24} height={24} priority={false} />
        </Button>
      </div>
    </form>
  )
}

export default InputControl
