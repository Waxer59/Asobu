export enum PATHNAMES {
  TEACH_MODE = '/ai/teach-mode',
  INDEX = '/ai',
  CHAT = '/ai/chat'
}

export const TRANSLATE_LANGUAGES = [
  'Afrikaans',
  'Arabic',
  'Armenian',
  'Azerbaijani',
  'Belarusian',
  'Bosnian',
  'Bulgarian',
  'Catalan',
  'Chinese',
  'Croatian',
  'Czech',
  'Danish',
  'Dutch',
  'English',
  'Estonian',
  'Finnish',
  'French',
  'Galician',
  'German',
  'Greek',
  'Hebrew',
  'Hindi',
  'Hungarian',
  'Icelandic',
  'Indonesian',
  'Italian',
  'Japanese',
  'Kannada',
  'Kazakh',
  'Korean',
  'Latvian',
  'Lithuanian',
  'Macedonian',
  'Malay',
  'Marathi',
  'Maori',
  'Nepali',
  'Norwegian',
  'Persian',
  'Polish',
  'Portuguese',
  'Romanian',
  'Russian',
  'Serbian',
  'Slovak',
  'Slovenian',
  'Spanish',
  'Swahili',
  'Swedish',
  'Tagalog',
  'Tamil',
  'Thai',
  'Turkish',
  'Ukrainian',
  'Urdu',
  'Vietnamese',
  'Welsh'
] as const;

export const FEATURES = [
  {
    header: 'Music',
    content: 'Enjoy seamless music playback through Spotify integration.'
  },
  {
    header: 'Navigation',
    content:
      'Ask for directions and navigate from point A to point B with ease.'
  },
  {
    header: 'Translation',
    content: 'Instantly translate text between multiple languages.'
  },
  {
    header: 'TeachMode',
    content: 'Get detailed explanations and solutions for academic problems.'
  },
  {
    header: 'Note Taking',
    content:
      'Jot down and organize your thoughts with an intuitive note-taking tool.'
  },
  {
    header: 'Chat',
    content: 'Engage in dynamic conversations with an AI-powered chatbot.'
  },
  {
    header: 'Image Recognition',
    content: 'Analyze images and receive insights based on visual content.'
  },
  {
    header: 'Voice Commands',
    content: 'Control Asobu hands-free using voice commands.'
  }
];
