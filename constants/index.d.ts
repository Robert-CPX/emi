// https://docs.inworld.ai/docs/tutorial-basics/personality-emotion/
export type MeimeiBehavior = "AFFECTION" | "ANGER" | "BELLIGERENCE" | "CONTEMPT" | "CRITICISM" | "DEFENSIVENESS" | "DISGUST" | "DOMINEERING" | "HUMOR" | "INTEREST" | "JOY" | "SADNESS" | "STONEWALLING" | "SURPRISE" | "TENSE" | "TENSION" | "VALIDATION" | "WHINING";

export type MeimeiEmotion = {
  behavior: MeimeiBehavior;
  strength: string;
}

export type ChatResponse = {
  role: string;
  content: string;
  emotion?: MeimeiEmotion;
}

export type VideoSource = {
  src: string;
  label: string;
}

export type TabDataType = {
  name: string;
  value: string;
}[]