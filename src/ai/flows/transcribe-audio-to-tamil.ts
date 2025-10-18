'use server';
/**
 * @fileOverview Transcribes audio files or recordings into Tamil text.
 *
 * - transcribeAudioToTamil - A function that handles the audio transcription process.
 * - TranscribeAudioToTamilInput - The input type for the transcribeAudioToTamil function.
 * - TranscribeAudioToTamilOutput - The return type for the transcribeAudioToTamil function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeAudioToTamilInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'An audio file or recording, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type TranscribeAudioToTamilInput = z.infer<typeof TranscribeAudioToTamilInputSchema>;

const TranscribeAudioToTamilOutputSchema = z.object({
  transcription: z.string().describe('The Tamil text transcribed from the audio.'),
});
export type TranscribeAudioToTamilOutput = z.infer<typeof TranscribeAudioToTamilOutputSchema>;

export async function transcribeAudioToTamil(
  input: TranscribeAudioToTamilInput
): Promise<TranscribeAudioToTamilOutput> {
  return transcribeAudioToTamilFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transcribeAudioToTamilPrompt',
  input: {schema: TranscribeAudioToTamilInputSchema},
  output: {schema: TranscribeAudioToTamilOutputSchema},
  prompt: `Transcribe the following audio into Tamil text.\n\nAudio: {{media url=audioDataUri}}`,
});

const transcribeAudioToTamilFlow = ai.defineFlow(
  {
    name: 'transcribeAudioToTamilFlow',
    inputSchema: TranscribeAudioToTamilInputSchema,
    outputSchema: TranscribeAudioToTamilOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
