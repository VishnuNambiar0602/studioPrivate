'use server';

/**
 * @fileOverview This file defines a Genkit flow to filter harmful messages from the chat.
 *
 * The flow uses a language model to check if a given message is harmful based on
 * pre-defined categories like hate speech, sexually explicit content, harassment,
 * dangerous content, and civic integrity. The flow returns a boolean indicating
 * whether the message is considered harmful.
 *
 * @exports {
 *   filterChatMessage - A function that filters the chat message.
 *   FilterChatMessageInput - The input type for the filterChatMessage function.
 *   FilterChatMessageOutput - The return type for the filterChatMessage function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FilterChatMessageInputSchema = z.object({
  message: z.string().describe('The chat message to filter.'),
});
export type FilterChatMessageInput = z.infer<typeof FilterChatMessageInputSchema>;

const FilterChatMessageOutputSchema = z.object({
  isHarmful: z.boolean().describe('Whether the chat message is harmful or not.'),
});
export type FilterChatMessageOutput = z.infer<typeof FilterChatMessageOutputSchema>;

export async function filterChatMessage(input: FilterChatMessageInput): Promise<FilterChatMessageOutput> {
  return filterChatMessageFlow(input);
}

const filterChatMessagePrompt = ai.definePrompt({
  name: 'filterChatMessagePrompt',
  input: {schema: FilterChatMessageInputSchema},
  output: {schema: FilterChatMessageOutputSchema},
  prompt: `You are an AI assistant that determines whether a given chat message is harmful or not.

  A harmful message is defined as one that contains hate speech, is sexually explicit, contains harassment,
  promotes dangerous content, or violates civic integrity.

  Given the following chat message, determine if it is harmful. Return true if the message is harmful, and false if it is not.

  Message: {{{message}}}`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const filterChatMessageFlow = ai.defineFlow(
  {
    name: 'filterChatMessageFlow',
    inputSchema: FilterChatMessageInputSchema,
    outputSchema: FilterChatMessageOutputSchema,
  },
  async input => {
    const {output} = await filterChatMessagePrompt(input);
    return output!;
  }
);
