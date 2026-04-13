import { z } from "zod";

export const RideSchemaPost = z.object({
  title: z.string().min(1, "Title is required").max(255),
  location: z.string().min(1, "Location is required").max(255),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price cannot be negative"),
});
