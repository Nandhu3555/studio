'use server';
/**
 * @fileOverview A flow to chat about a book.
 *
 * - chatAboutBook - A function that answers questions about a book.
 * - ChatAboutBookInput - The input type for the chatAboutBook function.
 * - ChatAboutBookOutput - The return type for the chatAboutBook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatAboutBookInputSchema = z.object({
  query: z.string().describe("The user's question about the book."),
  bookTitle: z.string().describe('The title of the book.'),
  bookDescription: z.string().describe('The description of the book.'),
  bookSummary: z.string().optional().describe('An existing AI-generated summary of the book.'),
});
export type ChatAboutBookInput = z.infer<typeof ChatAboutBookInputSchema>;

const ChatAboutBookOutputSchema = z.object({
  answer: z.string().describe("A helpful answer to the user's question."),
});
export type ChatAboutBookOutput = z.infer<typeof ChatAboutBookOutputSchema>;

export async function chatAboutBook(input: ChatAboutBookInput): Promise<ChatAboutBookOutput> {
  return chatAboutBookFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatAboutBookPrompt',
  input: {schema: ChatAboutBookInputSchema},
  output: {schema: ChatAboutBookOutputSchema},
  prompt: `You are an expert librarian's assistant. A user is asking a question about a book.
  
  Use the following information to answer their question. Base your answer ONLY on the provided context.

  Book Title: {{{bookTitle}}}
  Description: {{{bookDescription}}}
  {{#if bookSummary}}
  Summary: {{{bookSummary}}}
  {{/if}}

  User's Question: {{{query}}}
  
  Answer:`,
});

const chatAboutBookFlow = ai.defineFlow(
  {
    name: 'chatAboutBookFlow',
    inputSchema: ChatAboutBookInputSchema,
    outputSchema: ChatAboutBookOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
