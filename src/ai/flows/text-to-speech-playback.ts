'use server';
/**
 * @fileOverview Converts translated text back to voice using gTTS/Gemini Audio, with options for voice selection and speed control.
 *
 * - textToSpeechPlayback - A function that handles the text-to-speech conversion process.
 * - TextToSpeechPlaybackInput - The input type for the textToSpeechPlayback function.
 * - TextToSpeechPlaybackOutput - The return type for the textToSpeechPlayback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const TextToSpeechPlaybackInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  voiceName: z.string().optional().describe('The name of the voice to use.'),
});

export type TextToSpeechPlaybackInput = z.infer<typeof TextToSpeechPlaybackInputSchema>;

const TextToSpeechPlaybackOutputSchema = z.object({
  media: z.string().describe('The audio data in base64 encoded WAV format.'),
});

export type TextToSpeechPlaybackOutput = z.infer<typeof TextToSpeechPlaybackOutputSchema>;

export async function textToSpeechPlayback(input: TextToSpeechPlaybackInput): Promise<TextToSpeechPlaybackOutput> {
  return textToSpeechPlaybackFlow(input);
}

const textToSpeechPlaybackFlow = ai.defineFlow(
  {
    name: 'textToSpeechPlaybackFlow',
    inputSchema: TextToSpeechPlaybackInputSchema,
    outputSchema: TextToSpeechPlaybackOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: input.voiceName || 'Algenib' },
          },
        },
      },
      prompt: input.text,
    });

    if (!media) {
      throw new Error('no media returned');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
