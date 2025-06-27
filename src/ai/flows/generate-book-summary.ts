'use server';

/**
 * @fileOverview A flow to generate a summary for a given book.
 *
 * - generateBookSummary - A function that generates a book summary.
 * - GenerateBookSummaryInput - The input type for the generateBookSummary function.
 * - GenerateBookSummaryOutput - The return type for the generateBookSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookSummaryInputSchema = z.object({
  bookTitle: z.string().describe('The title of the book.'),
  bookDescription: z.string().describe('A description of the book.'),
});
export type GenerateBookSummaryInput = z.infer<typeof GenerateBookSummaryInputSchema>;

const GenerateBookSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the book.'),
});
export type GenerateBookSummaryOutput = z.infer<typeof GenerateBookSummaryOutputSchema>;

export async function generateBookSummary(input: GenerateBookSummaryInput): Promise<GenerateBookSummaryOutput> {
  return generateBookSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBookSummaryPrompt',
  input: {schema: GenerateBookSummaryInputSchema},
  output: {schema: GenerateBookSummaryOutputSchema},
  prompt: `You are an expert book summarizer. Please provide a concise and informative summary for the book "{{{bookTitle}}}" based on the following description: {{{bookDescription}}}. The summary should give the reader a good understanding of the book's content and main themes.`,
});

const generateBookSummaryFlow = ai.defineFlow(
  {
    name: 'generateBookSummaryFlow',
    inputSchema: GenerateBookSummaryInputSchema,
    outputSchema: GenerateBookSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
