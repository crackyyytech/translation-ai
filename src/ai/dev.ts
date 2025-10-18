import { config } from 'dotenv';
config();

import '@/ai/flows/transcribe-audio-to-tamil.ts';
import '@/ai/flows/normalize-slang-tamil.ts';
import '@/ai/flows/translate-tamil-to-target-language.ts';
import '@/ai/flows/text-to-speech-playback.ts';
import '@/ai/flows/correct-tamil-grammar.ts';
import '@/ai/flows/summarize-audio-content.ts';
import '@/ai/flows/detect-emotion-tone.ts';