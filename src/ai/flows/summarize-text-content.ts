'use server';
/**
 * @fileOverview Summarizes long text content in both Tamil and the translated language.
 *
 * - summarizeTextContent - A function that handles the text summarization process.
 * - SummarizeTextContentInput - The input type for the summarizeTextContent function.
 * - SummarizeTextContentOutput - The return type for the summarizeTextContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTextContentInputSchema = z.object({
  textContent: z
    .string()
    .describe('The text content to summarize, which will be in Tamil.'),
  targetLanguage: z.string().describe('The language to translate the summary to.'),
});
export type SummarizeTextContentInput = z.infer<typeof SummarizeTextContentInputSchema>;

const SummarizeTextContentOutputSchema = z.object({
  tamilSummary: z.string().describe('The summary of the text content in Tamil.'),
  translatedSummary: z
    .string()
    .describe('The summary of the text content in the target language.'),
});
export type SummarizeTextContentOutput = z.infer<typeof SummarizeTextContentOutputSchema>;

export async function summarizeTextContent(
  input: SummarizeTextContentInput
): Promise<SummarizeTextContentOutput> {
  return summarizeTextContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTextContentPrompt',
  input: {schema: SummarizeTextContentInputSchema},
  output: {schema: SummarizeTextContentOutputSchema},
  prompt: `You are an expert summarizer. You will be provided with text content in Tamil. Generate a concise summary of the content in Tamil, and then translate that summary to the specified target language.

Text Content:
{{{textContent}}}

Target Language: {{{targetLanguage}}}`,
});

const summarizeTextContentFlow = ai.defineFlow(
  {
    name: 'summarizeTextContentFlow',
    inputSchema: SummarizeTextContentInputSchema,
    outputSchema: SummarizeTextContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
