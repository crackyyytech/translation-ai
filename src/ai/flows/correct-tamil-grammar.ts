'use server';

/**
 * @fileOverview This file defines a Genkit flow for correcting Tamil grammar.
 *
 * - correctTamilGrammar - A function that corrects grammatical errors in Tamil text.
 * - CorrectTamilGrammarInput - The input type for the correctTamilGrammar function.
 * - CorrectTamilGrammarOutput - The return type for the correctTamilGrammar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CorrectTamilGrammarInputSchema = z.object({
  tamilText: z.string().describe('The Tamil text to correct.'),
});
export type CorrectTamilGrammarInput = z.infer<typeof CorrectTamilGrammarInputSchema>;

const CorrectTamilGrammarOutputSchema = z.object({
  correctedTamilText: z.string().describe('The grammatically corrected Tamil text.'),
});
export type CorrectTamilGrammarOutput = z.infer<typeof CorrectTamilGrammarOutputSchema>;

export async function correctTamilGrammar(input: CorrectTamilGrammarInput): Promise<CorrectTamilGrammarOutput> {
  return correctTamilGrammarFlow(input);
}

const correctTamilGrammarPrompt = ai.definePrompt({
  name: 'correctTamilGrammarPrompt',
  input: {schema: CorrectTamilGrammarInputSchema},
  output: {schema: CorrectTamilGrammarOutputSchema},
  prompt: `You are a Tamil language expert. Your task is to correct any grammatical errors in the given Tamil text.

Tamil Text: {{{tamilText}}}

Corrected Tamil Text:`,
});

const correctTamilGrammarFlow = ai.defineFlow(
  {
    name: 'correctTamilGrammarFlow',
    inputSchema: CorrectTamilGrammarInputSchema,
    outputSchema: CorrectTamilGrammarOutputSchema,
  },
  async input => {
    const {output} = await correctTamilGrammarPrompt(input);
    return output!;
  }
);
