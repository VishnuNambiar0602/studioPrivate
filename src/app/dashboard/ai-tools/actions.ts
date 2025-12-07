"use server";

import { generateDateNightIdeas, GenerateDateNightIdeasInput } from "@/ai/flows/generate-date-night-ideas";
import { generateRomanticMessages, GenerateRomanticMessagesInput } from "@/ai/flows/generate-romantic-messages";

export async function getDateNightIdeaAction(input: GenerateDateNightIdeasInput) {
    try {
        const result = await generateDateNightIdeas(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to generate date night idea." };
    }
}

export async function getRomanticMessageAction(input: GenerateRomanticMessagesInput) {
    try {
        const result = await generateRomanticMessages(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to generate romantic message." };
    }
}
