'use client'
import { useCallback, useEffect, useState } from 'react';
import {
  AdditionalPhonemeInfo,
  Character,
  EmotionEvent,
  HistoryItem,
  InworldConnectionService,
  InworldPacket,
} from '@inworld/web-core';
import { InworldService } from '@/lib/connection';
import { Config } from '@/config';
import ChatRoom from './ChatRoom';
import { EmotionsMap } from '@/constants';
import { JSONToPreviousDialog } from '@/lib/utils';
import { useEmi } from '@/context/EmiProvider';

const Chat = () => {
  const [connection, setConnection] = useState<InworldConnectionService>();
  const [chatHistory, setChatHistory] = useState<HistoryItem[]>([]);
  const [lastMessages, setLastMessages] = useState<string>("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [savedDialog, setSavedDialog] = useState<string>("");
  const [emotionEvent, setEmotionEvent] = useState<EmotionEvent>();
  const [emotions, setEmotions] = useState<EmotionsMap>({});
  const { setEmotion: setEmiEmotion } = useEmi();

  const onHistoryChange = useCallback((history: HistoryItem[]) => {
    setChatHistory(history);
  }, []);

  const openConnection = useCallback(
    async (previousState?: string) => {
      const previousDialog = JSONToPreviousDialog(savedDialog);
      const service = new InworldService({
        onHistoryChange,
        capabilities: {
          interruptions: true,
          emotions: true,
          narratedActions: true
        },
        ...(previousDialog.length && { continuation: { previousDialog } }),
        ...(previousState && { continuation: { previousState } }),
        sceneName: Config.SCENE_NAME,
        playerName: "User",
        onPhoneme: (phonemes: AdditionalPhonemeInfo[]) => {
          console.log(phonemes);
        },
        onReady: async () => {
          console.log('Ready!');
        },
        onDisconnect: () => {
          console.log('Disconnect!');
        },
        onMessage: (inworldPacket: InworldPacket) => {
          if (
            inworldPacket.isEmotion() &&
            inworldPacket.packetId?.interactionId
          ) {
            setEmotionEvent(inworldPacket.emotions);
            setEmotions((currentState) => ({
              ...currentState,
              [inworldPacket.packetId.interactionId]: inworldPacket.emotions,
            }));
          }
          if (inworldPacket.isText()) {
            setLastMessages(inworldPacket.text.text);
          }
        },
      });
      const characters = await service.connection.getCharacters();
      if (characters.length) {
        console.log('Characters found:', characters);
        const avatars = characters.map((c: Character) => {
          const rpmImageUri = c?.assets?.rpmImageUriPortrait;
          const avatarImg = c?.assets?.avatarImg;

          return rpmImageUri || avatarImg || '';
        });
      } else {
        console.error('Character(s) not found. Was them added?:');
        return;
      }
      setConnection(service.connection);
      setCharacters(characters);
    },
    [
      onHistoryChange,
      savedDialog
    ]
  );

  useEffect(() => {
    if (!emotionEvent) return;
    setEmiEmotion(emotionEvent);
  }, [emotionEvent, setEmiEmotion]);

  useEffect(() => {
    openConnection();
  }, [openConnection]);

  return (
    <>
      {characters.length ? (
        <ChatRoom
          characters={characters}
          chatHistory={chatHistory}
          connection={connection!}
          emotions={emotions}
          lastMessages={lastMessages}
        />
      ) : (
        'Loading...'
      )}
    </>
  )
}

export default Chat
