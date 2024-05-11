'use client'
import { useCallback, useEffect, useRef, useState } from 'react';
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

interface AudioQueueItem {
  id: number;
  url: string;
}

const Chat = () => {
  const [connection, setConnection] = useState<InworldConnectionService>();
  const [chatHistory, setChatHistory] = useState<HistoryItem[]>([]);
  const [lastMessages, setLastMessages] = useState<string>("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [savedDialog, setSavedDialog] = useState<string>("");
  const [emotionEvent, setEmotionEvent] = useState<EmotionEvent>();
  const [emotions, setEmotions] = useState<EmotionsMap>({});
  const { setEmotion: setEmiEmotion } = useEmi();
  const [queue, setQueue] = useState<AudioQueueItem[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  let textList: string[] = [];

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
          narratedActions: true,
          audio: false,
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
            textList.push(inworldPacket.text.text);
          }
          if (inworldPacket.isInteractionEnd()) {
            handleTextToSpeechGroup();
          }
        },
      });
      const characters = await service.connection.getCharacters();
      if (characters.length) {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onHistoryChange, savedDialog]
  );

  const handleTextToSpeechGroup = async () => {
    const fetchPromises = textList.map((text, index) =>
      fetch("/api/modal/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error fetching TTS for text: ${text}`);
          }
          return response.blob();
        })
        .then((audioBlob) => {
          const newAudioUrl = URL.createObjectURL(audioBlob);
          return { id: index, url: newAudioUrl, text };
        })
        .catch((error) => {
          console.error(`Failed to fetch TTS for text: ${text}`, error);
          return { id: index, url: "", text }; // Ensure the item remains in the queue
        })
    );
    // Execute all promises concurrently while maintaining their original order
    const unorderedResults = await Promise.all(fetchPromises);

    // Order results based on their original index
    const orderedResults = unorderedResults.sort((a, b) => a.id - b.id);
    textList = [];
    setQueue(orderedResults);
  };

  const playNextInQueue = () => {
    if (queue.length > 0) {
      const [nextItem, ...remainingQueue] = queue;
      setQueue(remainingQueue);

      audioRef.current = new Audio(nextItem.url);
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
      setIsPlaying(true);

      audioRef.current.play().catch((error) => {
        console.error("Playback error:", error);
        setIsPlaying(false);
      });
    } else {
      setIsPlaying(false);
    }
  };

  // Automatically play audio when `audioUrl` is set
  useEffect(() => {
    if (!isPlaying && queue.length > 0) {
      playNextInQueue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, isPlaying]);

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
