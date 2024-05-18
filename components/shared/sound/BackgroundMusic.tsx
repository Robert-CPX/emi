"use client";

import React, { useEffect, useRef, useState } from 'react';
import { AUDIO_RESOURCES } from '@/constants/constants';
import { Volume2, VolumeX } from "lucide-react"
import { useEmi } from '@/context/EmiProvider';

const BackgroundMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const { mode } = useEmi();

  useEffect(() => {
    if (!mode) return;
    audioRef.current?.pause();
    if (mode === "focus") {
      const audio = new Audio(AUDIO_RESOURCES.BGM_FOCUS);
      audio.loop = true;
      audio.play();
      audioRef.current = audio;
    } else if (mode === "companion") {
      const audio = new Audio(AUDIO_RESOURCES.BGM_DEFAULT);
      audio.loop = true;
      audio.play();
      audioRef.current = audio;
    }
  }, [mode]);

  useEffect(() => {
    const audio = new Audio(AUDIO_RESOURCES.BGM_DEFAULT);
    audio.loop = true;
    audio.volume = isMuted ? 0.0 : 1.0;
    audio.play();

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0; // Reset audio to the beginning
    };
  }, [isMuted]);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteStatus = !isMuted;
      setIsMuted(newMuteStatus);
      audioRef.current.volume = newMuteStatus ? 0.0 : 1.0;
    }
  };

  return (
    <div className="fixed bottom-36 left-4 z-50 md:bottom-4 ">
      <button 
        onClick={toggleMute}
        className="rounded-full bg-gray-900/30 p-3 text-gray-200 shadow-lg hover:bg-gray-600 focus:outline-none">
        {isMuted ? <VolumeX /> : <Volume2 />}
      </button>
    </div>
  );
};

export default BackgroundMusic;
