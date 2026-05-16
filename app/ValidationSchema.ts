import { z } from "zod";

export const RideSchemaPost = z.object({
  title: z.string().min(1, "Title is required").max(255),
  location: z.string().min(1, "Location is required").max(255),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price cannot be negative"),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email format" })
    .endsWith("@albion.edu", "User must be an Albion Student"),
  password: z.string().min(8, "Password must have at least 8 characters"),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email format" })
    .endsWith("@albion.edu", "You must use an Albion email"),
  password: z.string().min(1, "Password is required"),
});