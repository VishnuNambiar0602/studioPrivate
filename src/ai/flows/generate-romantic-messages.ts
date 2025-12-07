'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating romantic messages using AI.
 *
 * The flow takes user preferences such as restaurant, cuisine, and activity types as input.
 * It then uses these preferences to generate a personalized romantic message.
 *
 * @interface GenerateRomanticMessagesInput - Defines the input schema for the generateRomanticMessages function.
 * @interface GenerateRomanticMessagesOutput - Defines the output schema for the generateRomanticMessages function.
 * @function generateRomanticMessages - The main function to generate romantic messages.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRomanticMessagesInputSchema = z.object({
  restaurantPreference: z.string().describe('Preferred type of restaurant (e.g., Italian, French).'),
  cuisinePreference: z.string().describe('Preferred cuisine (e.g., seafood, vegetarian).'),
  activityPreference: z.string().describe('Preferred type of activity (e.g., movies, hiking).'),
});

export type GenerateRomanticMessagesInput = z.infer<typeof GenerateRomanticMessagesInputSchema>;

const GenerateRomanticMessagesOutputSchema = z.object({
  romanticMessage: z.string().describe('A romantic message generated based on the user preferences.'),
});

export type GenerateRomanticMessagesOutput = z.infer<typeof GenerateRomanticMessagesOutputSchema>;

export async function generateRomanticMessages(input: GenerateRomanticMessagesInput): Promise<GenerateRomanticMessagesOutput> {
  return generateRomanticMessagesFlow(input);
}

const generateRomanticMessagesPrompt = ai.definePrompt({
  name: 'generateRomanticMessagesPrompt',
  input: {schema: GenerateRomanticMessagesInputSchema},
  output: {schema: GenerateRomanticMessagesOutputSchema},
  prompt: `You are a romantic message generator. Generate a heartfelt and creative romantic message based on the following preferences:

Restaurant Preference: {{{restaurantPreference}}}
Cuisine Preference: {{{cuisinePreference}}}
Activity Preference: {{{activityPreference}}}

The message should be no more than 50 words.
`,
});

const generateRomanticMessagesFlow = ai.defineFlow(
  {
    name: 'generateRomanticMessagesFlow',
    inputSchema: GenerateRomanticMessagesInputSchema,
    outputSchema: GenerateRomanticMessagesOutputSchema,
  },
  async input => {
    const {output} = await generateRomanticMessagesPrompt(input);
    return output!;
  }
);
