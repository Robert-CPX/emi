import { useState, useEffect } from 'react';
import { Howl } from 'howler';

const useSound = (src: string): (() => void) => {
  const [sound, setSound] = useState<Howl | null>(null);

  useEffect(() => {
    const newSound = new Howl({ src: [src] });
    setSound(newSound);
  }, [src]);

  const playSound = () => {
    if (sound) {
      sound.play();
    }
  };

  return playSound;
};

export default useSound;