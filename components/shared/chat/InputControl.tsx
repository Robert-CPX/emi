"use client"

import { FormEvent, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { Button } from "@/components/ui/button"

type InputControlProps = {
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleInput: (input: string) => void;
}

const InputControl = ({
  prompt,
  setPrompt,
  handleInput
}: InputControlProps) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleInput(prompt)
    setPrompt("")
  }

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "48px"
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [prompt])

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <span className={`text-500-10-12 mb-1 mr-3 self-end ${prompt.length >= 100 ? 'text-error' : 'text-[hsla(0,0%,82%,1)]'}`}>{`${prompt.length}/100`}</span>
      <div className="relative grow">
        <Textarea
          ref={textareaRef}
          maxLength={100}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Tell me about you today!"
          className="chat-textarea"
        />
        <Button disabled={!prompt} className="absolute bottom-1 right-0">
          <Image src="/assets/icons/send.svg" alt="send" width={24} height={24} />
        </Button>
      </div>
    </form>
  )
}

export default InputControl
