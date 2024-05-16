"use client";

import React, { useEffect } from 'react';
import { Howl } from 'howler';
import { AUDIO_RESOURCES} from '@/constants/constants';

const BackgroundMusic: React.FC = () => {
  useEffect(() => {
    const sound = new Howl({
      src: [AUDIO_RESOURCES.BGM_DEFAULT],
      autoplay: true,
      loop: true,
      volume: 0.0,
    });

    sound.play();

    return () => {
      sound.stop();
    };
  }, []);

  return null; // This component does not render anything visible
};

export default BackgroundMusic;