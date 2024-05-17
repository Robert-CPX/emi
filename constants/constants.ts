export const TabDataMobile = [
  { name: "focus", value: "focus" },
  { name: "companion", value: "companion" },
  { name: "history", value: "dredge-up" }
]
export const TabData = [
  { name: "focus", value: "focus" },
  { name: "companion", value: "companion" }
]

// Unique identifier for the countdown interval, used to clear the interval when the countdown is not needed
export const COUNTDOWN_ID = 'timer_countdown_id';
export const COUNTDOWN_REMAINING_SECONDS = 'timer_countdown_remaining_seconds';

export const EMI_RESOURCES = {
  character: 'emi/emi.vrm',
  background: 'emi/background.jpg',
  pencil: 'emi/objects/pencil.glb',
  chair: 'emi/objects/chair.glb',
  desk: 'emi/objects/desk.glb',
  tableTop: 'emi/objects/table-top.glb',
  emotionPath: 'emi/emotions/',
}

export const EMI_ANIMATIONS: { [key: string]: { idle: string, gestures: string[] } } = {
  DEFAULT: { idle: "idle.vrma", gestures: [] },
  INTRO: { idle: "Intro.vrma", gestures: [] },
  WRITING: { idle: "writing.vrma", gestures: [] },
  AFFECTION: { idle: "idle.vrma", gestures: ["talk1.vrma", "talk2.vrma"] },
  ANGER: { idle: "angry.vrma", gestures: ["angrypoint.vrma", "standing_arguing.vrma"] },
  BELLIGERENCE: { idle: "boxing.vrma", gestures: ["talk1.vrma"] },
  CONTEMPT: { idle: "idle_angry.vrma", gestures: ["angrypoint.vrma", "standing_arguing.vrma"] },
  CRITICISM: { idle: "idle_angry.vrma", gestures: ["angrypoint.vrma", "standing_arguing.vrma"] },
  DEFENSIVENESS: { idle: "idle_angry.vrma", gestures: [] },
  DISGUST: { idle: "idle_angry.vrma", gestures: ["angrypoint.vrma", "standing_arguing.vrma"] },
  DOMINEERING: { idle: "idle_relaxed.vrma", gestures: ["talk1.vrma"] },
  HUMOR: { idle: "idle_relaxed.vrma", gestures: ["talk1.vrma", "talk2.vrma", "thinking.vrma", "head_nod_yes.vrma", "chestpat.vrma"] },
  INTEREST: { idle: "idle.vrma", gestures: ["talk1.vrma", "talk2.vrma", "thinking.vrma", "head_nod_yes.vrma", "chestpat.vrma"] },
  JOY: { idle: "idle.vrma", gestures: ["talk1.vrma", "head_nod_yes.vrma", "wave.vrma"] },
  SADNESS: { idle: "idle_sad.vrma", gestures: [] },
  STONEWALLING: { idle: "idle.vrma", gestures: [] },
  SURPRISE: { idle: "idle_surprised.vrma", gestures: ["surprised.vrma"] },
  TENSE: { idle: "idle_surprised.vrma", gestures: ["surprised.vrma"] },
  TENSION: { idle: "idle_surprised.vrma", gestures: ["surprised.vrma"] },
  VALIDATION: { idle: "idle.vrma", gestures: ["head_nod_yes.vrma"] },
  WHINING: { idle: "idle_sad.vrma", gestures: ["talk1.vrma"] },
}

export const EMI_CLICK_AREA: { [area: string]: { animation: string, meshes: string[] } } = {
  HEAD: { animation: "click3.vrma", 
  meshes: ["Hair", 
  "Face_(merged)baked_custom_1", 
  "Face_(merged)baked_custom_2",
  "Face_(merged)baked_custom_3",
  "Face_(merged)baked_custom_4",
  "Face_(merged)baked_custom_5",
  "Face_(merged)baked_custom_6",
  "Face_(merged)baked_custom_6" ] },
  
  CHEST: { animation: "clickchest2.vrma", meshes: ["N00_007_02_Tops_01_CLOTH_(Instance)", "外套"] },
  OTHER: { animation: "clickchest2.vrma", meshes: [] }
}

export const AUDIO_RESOURCES = {
  BGM_DEFAULT: "assets/audio/BGM.wav",
  CLICK_SOUND: "assets/audio/bong_001.ogg",
  CLICK_CHARACTER_SOUND: "assets/audio/select_006.ogg",
  MESSAGE_SOUND: "assets/audio/message.ogg",
  HOVER_SOUND: "assets/audio/click.wav"
}

export const EMOJIS: { [key: string]: string[] } = {
  AFFECTION: ['🥰', '😊', '😘', '😍', '🤗'],
  ANGER: ['😤', '😠', '😡', '🤬'],
  BELLIGERENCE: ['😡'],
  CONTEMPT: ['😠'],
  CRITICISM: ['👎'],
  DEFENSIVENESS: ['✋'],
  DISGUST: ['🤢', '🤮', '😖'],
  DOMINEERING: ['😠'],
  HUMOR: ['😆 ', '😅', '😂', '🤣'],
  INTEREST: ['🧐', '🤔', '🤨'],
  JOY: ['😀', '😃', '😄', '😁', '😆'],
  SADNESS: ['😞', '😔', '😟', '😕', '🙁'],
  STONEWALLING: ['🤐', '😶', '🤫'],
  SURPRISE: ['😲', '😮', '😧', '😳', '🤯'],
  TENSE: ['😬'],
  TENSION: ['😬', '😰'],
  VALIDATION: ['👍', '👌'],
  WHINING: ['😩', '🥺', '😢', '😭', '😮‍💨'],
};

export const MockEmotionList = [
  { "behavior": "AFFECTION", "strength": "STRONG" },
  { "behavior": "ANGER", "strength": "STRONG" },
  { "behavior": "BELLIGERENCE", "strength": "STRONG" },
  { "behavior": "CRITICISM", "strength": "STRONG" },
  { "behavior": "DEFENSIVENESS", "strength": "STRONG" },
  { "behavior": "HUMOR", "strength": "STRONG" },
  { "behavior": "INTEREST", "strength": "STRONG" },
  { "behavior": "JOY", "strength": "STRONG" },
  { "behavior": "SADNESS", "strength": "STRONG" },
  { "behavior": "TENSION", "strength": "STRONG" },
  { "behavior": "VALIDATION", "strength": "STRONG" },
  { "behavior": "WHINING", "strength": "STRONG" }
]

export const MockChatHistory = [
  {
    "role": "user",
    "content": "Hi, what’s the weather like in New York today?"
  },
  {
    "role": "assistant",
    "content": "Hello! Today in New York, it’s partly cloudy with a high of 75°F and a low of 58°F."
  },
  {
    "role": "user",
    "content": "Thanks! Can you also tell me if any good movies are releasing this weekend?"
  },
  {
    "role": "assistant",
    "content": "Certainly! This weekend the following movies are releasing:\n1. Guardians of the Galaxy Vol. 3 - Sci-fi adventure.\n2. The French Dispatch - Comedy drama.\n3. Last Night in Soho - Psychological thriller."
  },
  {
    "role": "user",
    "content": "Great! How do I get tickets for Guardians of the Galaxy Vol. 3?"
  },
  {
    "role": "assistant",
    "content": "You can purchase tickets online through AMC Theatres or Fandango. Would you like a link to one of these sites?"
  },
  {
    "role": "user",
    "content": "Yes, please send me the link to Fandango."
  },
  {
    "role": "assistant",
    "content": "Here you go: [Fandango - Guardians of the Galaxy Vol. 3](https://www.fandango.com/guardians-of-the-galaxy-vol-3-2023-224033/movie-overview). Enjoy the movie!"
  },
  {
    "role": "user",
    "content": "Thanks! How about some restaurant recommendations nearby for dinner after the movie?"
  },
  {
    "role": "assistant",
    "content": "Sure! Here are a few popular choices near the theater:\n- Tony’s Pizza - Known for its authentic New York-style pizza.\n- The Green Spot - Offers a variety of vegan and vegetarian dishes.\n- El Toro Loco - Great for Mexican cuisine and margaritas."
  },
  {
    "role": "user",
    "content": "Could you book a table for two at The Green Spot at 7 PM?"
  },
  {
    "role": "assistant",
    "content": "I'm sorry, but I can't make reservations directly. However, you can book a table through OpenTable. Would you like the link to make a reservation?"
  },
  {
    "role": "user",
    "content": "Yes, that would be helpful, thanks!"
  },
  {
    "role": "assistant",
    "content": "Here's the link: [OpenTable - The Green Spot](https://www.opentable.com/the-green-spot). Enjoy your dinner!"
  },
  {
    "role": "user",
    "content": "Thanks for all your help!"
  },
  {
    "role": "assistant",
    "content": "You're welcome! If you have any more questions, feel free to ask. Enjoy your day!"
  }
]