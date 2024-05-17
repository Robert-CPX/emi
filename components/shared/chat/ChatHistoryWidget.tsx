// Desc: Display chat history in ChatRoom.tsx, different design on mobile and desktop.
"use client"

import { useEffect, useRef, useState } from "react";
import React from "react";
import {
  CHAT_HISTORY_TYPE,
  Character,
  HistoryItem,
  HistoryItemActor,
  HistoryItemNarratedAction,
  HistoryItemTriggerEvent
} from "@inworld/web-core";
import { CombinedHistoryItem, EmotionsMap } from "@/constants";
import { dateWithMilliseconds, getEmoji } from "@/lib/utils";
import Typing from "@/components/shared/chat/Typing";

interface ChatHistoryWidgetProps {
  history: HistoryItem[];
  emotions: EmotionsMap;
  characters: Character[];
  onInteractionEnd: (value: boolean, content: string) => void;
}

const ChatHistoryWidget = (props: ChatHistoryWidgetProps) => {
  const { history, onInteractionEnd } = props
  const [combinedChatHistory, setCombinedChatHistory] = useState<CombinedHistoryItem[]>([]);
  const [isInteractionEnd, setIsInteractionEnd] = useState<boolean>(true);
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history]);

  useEffect(() => {
    let currentRecord: CombinedHistoryItem | undefined;
    const mergedRecords: CombinedHistoryItem[] = [];
    const hasActors = history.find(
      (record: HistoryItem) => record.type === CHAT_HISTORY_TYPE.ACTOR,
    );
    const withoutTriggerEvents = history.filter((record: HistoryItem) =>
      [CHAT_HISTORY_TYPE.ACTOR, CHAT_HISTORY_TYPE.INTERACTION_END].includes(
        record.type
      )
    )
    for (let i = 0; i < history.length; i++) {
      let item = history[i];
      switch (item.type) {
        case CHAT_HISTORY_TYPE.ACTOR:
        case CHAT_HISTORY_TYPE.NARRATED_ACTION:
          currentRecord = mergedRecords.find((r) =>
            r.interactionId === item.interactionId &&
            [CHAT_HISTORY_TYPE.ACTOR, CHAT_HISTORY_TYPE.NARRATED_ACTION].includes(r.messages?.[0]?.type) &&
            r.type === CHAT_HISTORY_TYPE.ACTOR &&
            r.source.name === item.source.name
          ) as CombinedHistoryItem;

          if (currentRecord) {
            currentRecord.messages.push(item);
          } else {
            currentRecord = {
              type: CHAT_HISTORY_TYPE.ACTOR,
              interactionId: item.interactionId!,
              source: item.source,
              messages: [item],
            } as CombinedHistoryItem;
            mergedRecords.push(currentRecord);
          }
          break;
        case CHAT_HISTORY_TYPE.TRIGGER_EVENT:
          mergedRecords.push({
            type: item.type,
            source: item.source,
            messages: [item],
            interactionId: item.interactionId!,
          });
          break;
      }
    }
    // Interaction is considered ended
    // when there is no actor action yet (chat is not started)
    // or last received message is INTERACTION_END.
    const lastInteractionId = withoutTriggerEvents[withoutTriggerEvents.length - 1]?.interactionId;
    const interactionEnd = withoutTriggerEvents.find(
      (event) =>
        event.interactionId === lastInteractionId &&
        event.type === CHAT_HISTORY_TYPE.INTERACTION_END
    );
    const isEnd = !hasActors || (!!interactionEnd && !!currentRecord);
    setIsInteractionEnd(isEnd);
    onInteractionEnd(isEnd, isEnd ? spanRef.current?.textContent || "" : "");
    setCombinedChatHistory(mergedRecords);
  }, [history, onInteractionEnd]);

  const getContent = (
    message:
      HistoryItemActor |
      HistoryItemNarratedAction |
      HistoryItemTriggerEvent
  ) => {
    switch (message.type) {
      case CHAT_HISTORY_TYPE.ACTOR:
        return message.text;
      case CHAT_HISTORY_TYPE.NARRATED_ACTION:
        return message.text;
      case CHAT_HISTORY_TYPE.TRIGGER_EVENT:
        return message.name;
    }
  }

  return (
    <div className="flex flex-col">
      {combinedChatHistory.map((item, index) => {
        let emoji: string | null = null;
        let messages = item.messages;
        let actorSource = 'AGENT';
        let message = item.messages?.[0];
        const character = props.characters.find(
          (c) => c.id === item.source.name,
        );
        const title =
          item.type === CHAT_HISTORY_TYPE.ACTOR ||
            item.type === CHAT_HISTORY_TYPE.TRIGGER_EVENT
            ? `${dateWithMilliseconds(message.date)} (${item.interactionId
            })`
            : '';
        if (item.type === CHAT_HISTORY_TYPE.ACTOR) {
          actorSource = item.source.isCharacter ? 'AGENT' : 'PLAYER';

          if (item.source.isCharacter) {
            const emotion = props.emotions[item.interactionId!];
            if (emotion?.behavior) {
              emoji = getEmoji(emotion.behavior);
            }
          }
        }
        return (
          <React.Fragment key={`ChatHistoryGroup-${index}`}>
            <div className={`${actorSource === "PLAYER" ? "chat-user" : "chat-ai"} chat-bubble-container`}>
              <span className="chat-text" ref={spanRef}>
                {messages.map((m) => (
                  <React.Fragment key={m.id}>
                    {getContent(m)}{' '}
                  </React.Fragment>
                ))}
              </span>
            </div>
          </React.Fragment>
        )
      })}
      <Typing isInteractionEnd={isInteractionEnd} />
      {/* An invisible div to mark the end of messages*/}
      <div ref={endOfMessagesRef} />
    </div>
  )
}

export default ChatHistoryWidget