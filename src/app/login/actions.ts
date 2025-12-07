"use server";

import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// NOTE: In a real application, these would be environment variables.
// For this romantic app, hardcoding is part of the charm.
const HARDCODED_EMAIL = "mylove@forever.us";
const HARDCODED_PASSWORD = "password";

export async function login(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!", success: false };
  }

  const { email, password } = validatedFields.data;

  if (email.toLowerCase() === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
    // In a real app, you would create a session here (e.g., with cookies or JWT)
    return { success: true };
  }

  return { error: "Incorrect email or password. Try our special date!", success: false };
}
