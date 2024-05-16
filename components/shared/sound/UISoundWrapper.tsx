"use client"; // Ensure this component is treated as a client component

import React, { ReactNode } from 'react';
import useSound from '@/components/shared/sound/use-sound';
import { AUDIO_RESOURCES } from "@/constants/constants"

interface UISoundWrapperProps {
  children: ReactNode;
  className?: string;
}

const UISoundWrapper: React.FC<UISoundWrapperProps> = ({ children, className}) => {
  const playClickSound = useSound(AUDIO_RESOURCES.CLICK_SOUND);

  return (
    <div
      onClick={playClickSound}
      className={className}
    >
      {children}
    </div>
  );
};

export default UISoundWrapper;