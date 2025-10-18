// src/ai/flows/translate-tamil-to-target-language.ts
'use server';
/**
 * @fileOverview Translates normalized Tamil text to a selected target language.
 *
 * - translateTamilToTargetLanguage - A function that translates Tamil text to a target language.
 * - TranslateTamilToTargetLanguageInput - The input type for the translateTamilToTargetLanguage function.
 * - TranslateTamilToTargetLanguageOutput - The return type for the translateTamilToTargetLanguage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTamilToTargetLanguageInputSchema = z.object({
  tamilText: z.string().describe('The Tamil text to translate.'),
  targetLanguage: z.string().describe('The target language to translate to.'),
});
export type TranslateTamilToTargetLanguageInput = z.infer<
  typeof TranslateTamilToTargetLanguageInputSchema
>;

const TranslateTamilToTargetLanguageOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTamilToTargetLanguageOutput = z.infer<
  typeof TranslateTamilToTargetLanguageOutputSchema
>;

export async function translateTamilToTargetLanguage(
  input: TranslateTamilToTargetLanguageInput
): Promise<TranslateTamilToTargetLanguageOutput> {
  return translateTamilToTargetLanguageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTamilToTargetLanguagePrompt',
  input: {schema: TranslateTamilToTargetLanguageInputSchema},
  output: {schema: TranslateTamilToTargetLanguageOutputSchema},
  prompt: `Translate the following Tamil text to {{{targetLanguage}}}:\n\n{{{tamilText}}}`,
});

const translateTamilToTargetLanguageFlow = ai.defineFlow(
  {
    name: 'translateTamilToTargetLanguageFlow',
    inputSchema: TranslateTamilToTargetLanguageInputSchema,
    outputSchema: TranslateTamilToTargetLanguageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
