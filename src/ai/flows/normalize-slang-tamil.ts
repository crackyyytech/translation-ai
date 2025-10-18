'use server';

/**
 * @fileOverview A flow that normalizes slang Tamil text into standard Tamil.
 *
 * - normalizeSlangTamil - A function that handles the slang normalization process.
 * - NormalizeSlangTamilInput - The input type for the normalizeSlangTamil function.
 * - NormalizeSlangTamilOutput - The return type for the normalizeSlangTamil function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NormalizeSlangTamilInputSchema = z.object({
  tamilText: z.string().describe('The Tamil text to normalize.'),
});
export type NormalizeSlangTamilInput = z.infer<typeof NormalizeSlangTamilInputSchema>;

const NormalizeSlangTamilOutputSchema = z.object({
  normalizedTamilText: z.string().describe('The normalized Tamil text in standard form.'),
});
export type NormalizeSlangTamilOutput = z.infer<typeof NormalizeSlangTamilOutputSchema>;

export async function normalizeSlangTamil(input: NormalizeSlangTamilInput): Promise<NormalizeSlangTamilOutput> {
  return normalizeSlangTamilFlow(input);
}

const prompt = ai.definePrompt({
  name: 'normalizeSlangTamilPrompt',
  input: {schema: NormalizeSlangTamilInputSchema},
  output: {schema: NormalizeSlangTamilOutputSchema},
  prompt: `You are an expert in Tamil slang and its equivalent standard Tamil.

  Please normalize the following Tamil text, converting any slang terms into their standard Tamil equivalents. Provide the normalized Tamil text as output.

  Tamil Text: {{{tamilText}}}`,
});

const normalizeSlangTamilFlow = ai.defineFlow(
  {
    name: 'normalizeSlangTamilFlow',
    inputSchema: NormalizeSlangTamilInputSchema,
    outputSchema: NormalizeSlangTamilOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
