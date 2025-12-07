'use server';

/**
 * @fileOverview Generates date night ideas based on user preferences for restaurants, cuisines, and activities.
 *
 * - generateDateNightIdeas - A function that generates date night ideas.
 * - GenerateDateNightIdeasInput - The input type for the generateDateNightIdeas function.
 * - GenerateDateNightIdeasOutput - The return type for the generateDateNightIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDateNightIdeasInputSchema = z.object({
  restaurantPreference: z
    .string()
    .describe('Preference for restaurants (e.g., fancy, casual, price range).'),
  cuisinePreference: z
    .string()
    .describe('Preferred cuisine (e.g., Italian, Mexican, Thai).'),
  activityPreference: z
    .string()
    .describe('Preferred activity (e.g., movies, hiking, board games).'),
});
export type GenerateDateNightIdeasInput = z.infer<typeof GenerateDateNightIdeasInputSchema>;

const GenerateDateNightIdeasOutputSchema = z.object({
  dateNightIdea: z
    .string()
    .describe('A creative date night idea based on the provided preferences.'),
});
export type GenerateDateNightIdeasOutput = z.infer<typeof GenerateDateNightIdeasOutputSchema>;

export async function generateDateNightIdeas(input: GenerateDateNightIdeasInput): Promise<GenerateDateNightIdeasOutput> {
  return generateDateNightIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDateNightIdeasPrompt',
  input: {schema: GenerateDateNightIdeasInputSchema},
  output: {schema: GenerateDateNightIdeasOutputSchema},
  prompt: `You are a date night idea generator. Given the following preferences, generate a creative and unique date night idea. Consider the restaurant, cuisine, and activity preferences when crafting the idea.\n\nRestaurant Preference: {{{restaurantPreference}}}\nCuisine Preference: {{{cuisinePreference}}}\nActivity Preference: {{{activityPreference}}}\n\nDate Night Idea: `,
});

const generateDateNightIdeasFlow = ai.defineFlow(
  {
    name: 'generateDateNightIdeasFlow',
    inputSchema: GenerateDateNightIdeasInputSchema,
    outputSchema: GenerateDateNightIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
