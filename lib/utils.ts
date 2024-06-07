import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { EMOJIS, EMI_ANIMATIONS } from "@/constants/constants"
import { MockEmotionList } from "@/constants/constants"
import { DialogPhrase, EmotionBehavior, EmotionEvent } from "@inworld/web-core"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ERROR HANDLER
export const handleError = (error: unknown): never => {
  if (error instanceof Error) {
    // This is a native JavaScript error (e.g., TypeError, RangeError)
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    // This is a string error message
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    // This is an unknown type of error
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const isMinuteInRange = (str: string): boolean => {
  const num = Number(str);
  return !isNaN(num) && num >= 0 && num <= 120;
}

export const isSecondInRange = (str: string): boolean => {
  const num = Number(str);
  return !isNaN(num) && num >= 0 && num <= 60;
}

export const formatMinutesAndSeconds = (str: string | null): string => {
  if (str === null) {
    return "00";
  }

  const num = Number(str);
  if (!isNaN(num) && num >= 0) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return String(num);
    }
  }

  throw new Error(`Invalid number: ${str}`);
};

export const generateTimeOptions = (): number[] => {
  const list: number[] = [];
  for (let i = 5; i <= 120; i += 5) {
    list.push(i);
  }
  // list.unshift(0.1);
  return list;
};

export function getRandomAnimation(): { idle: string; gestures: string[]; } {
  const keys = Object.keys(EMI_ANIMATIONS);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return EMI_ANIMATIONS[randomKey as keyof typeof EMI_ANIMATIONS];
}

export function getAnimation(emotion: EmotionEvent): { idle: string; gestures: string[]; } {
  const code = emotion.behavior.code;
  return EMI_ANIMATIONS[code];
}

export function getRandomEmotion(): any {
  return MockEmotionList[Math.floor(Math.random() * MockEmotionList.length)];
}

export const JSONToPreviousDialog = (json: string) => {
  const data = json ? JSON.parse(json) : [];

  return data.map(({ talker, phrase }: { talker: string; phrase: string }) => ({
    talker,
    phrase,
  })) as DialogPhrase[];
};

export const dateWithMilliseconds = (date: Date) =>
  `${date.toLocaleString()}.${date.getMilliseconds()}`;

export function getEmoji(behavior: EmotionBehavior): string | null {
  const emoji = EMOJIS[behavior.code];

  if (!emoji?.length) return null;

  return emoji.length < 2
    ? emoji[0]
    : emoji[Math.floor(Math.random() * emoji.length)];
}

export const playSound = (url: string) => {
  const audio = new Audio(url);
  audio.play();
};

export const formatGoalDurationTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds} seconds`

  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)} minute${Math.floor(minutes) !== 1 ? 's' : ''}`

  const hours = minutes / 60;
  const decimalHours = parseFloat(hours.toFixed(1)); // Round to one decimal place
  return `${decimalHours} hour${decimalHours !== 1 ? 's' : ''}`
}

export const generatePromptWhileCreatingAGoal = (
  title: string,
  description: string,
  isLongTerm: boolean
): string => {
  const p1 = `Hey, I'm setting a new goal for myself. I want to ${title}, to be more specific, ${description}. ${isLongTerm && "This is a long-term goal"}. It would mean a lot if you could give me some encouraging words to help me push through.`
  const p2 = 'Please go directly, no Hello or greeting. Just start with the encouraging words. Thank you!'
  return p1 + p2;
}

export const isOver24Hours = (dateString: string): boolean => {
  const currentDate = new Date();
  const givenDate = new Date(dateString);
  const timeDifference = currentDate.getTime() - givenDate.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);
  return hoursDifference > 24;
};