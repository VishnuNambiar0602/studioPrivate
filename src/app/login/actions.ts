"use server";

import * as z from "zod";

const loginSchema = z.object({
  petName: z.string().min(1, "A pet name is required."),
});

const VALID_PET_NAMES = ["vishnu", "vaishakhanandini"];

export async function login(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid field!", success: false };
  }

  const { petName } = validatedFields.data;

  if (VALID_PET_NAMES.includes(petName.toLowerCase())) {
    // In a real app, you would create a session here (e.g., with cookies or JWT)
    return { success: true };
  }

  return { error: "That's not the secret name I know.", success: false };
}
