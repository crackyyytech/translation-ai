'use server';
/**
 * @fileOverview Summarizes long audio content in both Tamil and the translated language.
 *
 * - summarizeAudioContent - A function that handles the audio summarization process.
 * - SummarizeAudioContentInput - The input type for the summarizeAudioContent function.
 * - SummarizeAudioContentOutput - The return type for the summarizeAudioContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAudioContentInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio content to summarize, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  targetLanguage: z.string().describe('The language to translate the summary to.'),
});
export type SummarizeAudioContentInput = z.infer<typeof SummarizeAudioContentInputSchema>;

const SummarizeAudioContentOutputSchema = z.object({
  tamilSummary: z.string().describe('The summary of the audio content in Tamil.'),
  translatedSummary: z
    .string()
    .describe('The summary of the audio content in the target language.'),
});
export type SummarizeAudioContentOutput = z.infer<typeof SummarizeAudioContentOutputSchema>;

export async function summarizeAudioContent(
  input: SummarizeAudioContentInput
): Promise<SummarizeAudioContentOutput> {
  return summarizeAudioContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAudioContentPrompt',
  input: {schema: SummarizeAudioContentInputSchema},
  output: {schema: SummarizeAudioContentOutputSchema},
  prompt: `You are an expert summarizer of audio content.  You will be provided
an audio file in Tamil.  You will generate a summary of the audio content in
Tamil, and then translate that summary to the target language.

Audio: {{media url=audioDataUri}}

Target Language: {{{targetLanguage}}}`,
});

const summarizeAudioContentFlow = ai.defineFlow(
  {
    name: 'summarizeAudioContentFlow',
    inputSchema: SummarizeAudioContentInputSchema,
    outputSchema: SummarizeAudioContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
