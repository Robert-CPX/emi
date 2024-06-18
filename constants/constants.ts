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
export const USER_SELECTED_GOAL_ID = 'selected_goal_id';
export const USER_ACTIVITY_ID = 'inprogress_activity_id';

export const NEW_USER = 'new_user';

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
  IDLE: { idle: "thinking.vrma", gestures: ["thinking.vrma", "bashful.vrma", "happy.vrma", "stretch.vrma"] },
  INTRO: { idle: "Intro.vrma", gestures: [] },
  LOGIN: { idle: "waku.vrma", gestures: [] },
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

export const EMI_CLICK_AREA: { [area: string]: { animation: string, meshes: string[], voiceline: string } } = {
  HEAD: { animation: "click3.vrma", 
  meshes: ["Hair", 
  "Face_(merged)baked_custom_1", 
  "Face_(merged)baked_custom_2",
  "Face_(merged)baked_custom_3",
  "Face_(merged)baked_custom_4",
  "Face_(merged)baked_custom_5",
  "Face_(merged)baked_custom_6",
  "Face_(merged)baked_custom_6" ],
  voiceline: "assets/audio/click_head.wav" },
  
  CHEST: { animation: "clickchest2.vrma", meshes: ["N00_007_02_Tops_01_CLOTH_(Instance)", "外套"], voiceline: "assets/audio/click_chest.wav" },
  OTHER: { animation: "clickchest2.vrma", meshes: [], voiceline: "assets/audio/click_chest.wav"  }
}

export const EMI_MATERIAL_NAME = {
  FACE: "N00_000_00_Face_00_SKIN (Instance).001", 
  FACE_OUTLINE: "N00_000_00_Face_00_SKIN (Instance).001 (Outline)", 
  BODY: "N00_000_00_Body_00_SKIN (Instance)", 
  BODY_OUTLINE: "N00_000_00_Body_00_SKIN (Instance) (Outline)", 
  HAIR: "N00_000_Hair_00_HAIR (Instance)", 
  CLOTHES: "材质.001", 
  SKIRT: "N00_001_03_Bottoms_01_CLOTH (Instance)"
}

export const AUDIO_RESOURCES = {
  BGM_DEFAULT: "assets/audio/BGM.wav",
  BGM_FOCUS: "assets/audio/BGM_focus.mp3",
  CLICK_SOUND: "assets/audio/bong_001.ogg",
  CLICK_CHARACTER_SOUND: "assets/audio/select_006.ogg",
  MESSAGE_SOUND: "assets/audio/message.ogg",
  HOVER_SOUND: "assets/audio/click.wav",
  ONBOARDING_DIALOGUE: "assets/audio/onboarding.wav",
  LOGIN_FIRST: "assets/audio/login_first.wav",
  LOGIN: "assets/audio/login.wav",
  IDLE: "assets/audio/idle.wav",
  GOAL_CREATED: "assets/audio/goal_created.mp3"
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