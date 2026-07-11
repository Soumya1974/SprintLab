import { z } from "zod";

export const userSignUpSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("Not a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

export const userLoginSchema = z.object({
    email: z.email("Not a valid email"),
    password: z.string().min(8, "Entered password must be at least 8 characters")
});

export const validateEmailSchema = z.object({
    email: z.string().email("Not a valid email")
}).passthrough();