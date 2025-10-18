'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting the emotion tone of a given text.
 *
 * The flow uses a prompt to analyze the text and determine its emotion (e.g., happy, sad, angry).
 * It exports the `detectEmotionTone` function, `DetectEmotionToneInput` type, and `DetectEmotionToneOutput` type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectEmotionToneInputSchema = z.object({
  text: z.string().describe('The text to analyze for emotion tone.'),
});
export type DetectEmotionToneInput = z.infer<typeof DetectEmotionToneInputSchema>;

const DetectEmotionToneOutputSchema = z.object({
  emotion: z
    .string()
    .describe(
      'The detected emotion tone of the text (e.g., happy, sad, angry, neutral).' // Explicitly state 'neutral'
    ),
});
export type DetectEmotionToneOutput = z.infer<typeof DetectEmotionToneOutputSchema>;

export async function detectEmotionTone(input: DetectEmotionToneInput): Promise<DetectEmotionToneOutput> {
  return detectEmotionToneFlow(input);
}

const detectEmotionTonePrompt = ai.definePrompt({
  name: 'detectEmotionTonePrompt',
  input: {schema: DetectEmotionToneInputSchema},
  output: {schema: DetectEmotionToneOutputSchema},
  prompt: `You are an AI expert in understanding the nuances of human emotion.

  Analyze the following text and determine its primary emotion tone. Possible emotion tones are: happy, sad, angry, neutral.
  Return ONLY one of the specified possible emotion tones.
  Text: {{{text}}}`, // Ensure valid Handlebars syntax
});

const detectEmotionToneFlow = ai.defineFlow(
  {
    name: 'detectEmotionToneFlow',
    inputSchema: DetectEmotionToneInputSchema,
    outputSchema: DetectEmotionToneOutputSchema,
  },
  async input => {
    const {output} = await detectEmotionTonePrompt(input);
    return output!;
  }
);
