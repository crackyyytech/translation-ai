# **App Name**: Tamil Transcribe AI

## Core Features:

- Real-time Transcription: Transcribe voice input or audio files to Tamil text using Whisper.
- AI Slang Normalization: Convert slang Tamil into standard Tamil using AI and context analysis. Include a slang look-up tool.
- Multi-Language Translation: Translate normalized Tamil to a selected target language in real-time using Google Translate API or Gemini. Detect input language automatically.
- AI-Powered Grammar Correction: Correct grammar and context of Tamil text using AI models like Gemini or OpenAI to produce polished standard text. This should be used as a tool in case the model determines grammar correctness is needed.
- Emotion Tone Detection: Detect the emotion tone (happy, sad, angry) in the translated text and display an appropriate icon. Tone analysis should be used as a tool, displayed only when appropriate.
- Summarization: Summarize long audio content in both Tamil and the translated language using AI summarization techniques.
- PDF Report Generation: Generate a multi-section PDF report with original, normalized, and translated text, along with emotion analysis and summaries.
- Text-to-Speech Playback: Convert translated text back to voice using gTTS/Gemini Audio, with options for voice selection and speed control.

## Style Guidelines:

- Primary color: Light desaturated green (#90EE90) to convey clarity.
- Background color: White (#FFFFFF) for clean interface and readability.
- Accent color: Blue (#ADD8E6) to bring clarity.
- Implement a two-pane interface with normalized Tamil on the left and translated text with emotion/summary on the right. Include a top toolbar with icons for key actions. Add a loading animation and AI processing bar.
- Use 'PT Sans' (serif) for Tamil text for better readability, and 'Inter' (sans-serif) for English and other languages. Note: currently only Google Fonts are supported.
- Design clear and intuitive icons for actions like recording, uploading, language selection, download, and settings.
- Incorporate subtle animations for loading states and AI processing to enhance the user experience.