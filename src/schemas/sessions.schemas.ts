import { z } from "zod";
export const exerciseSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  sets: z.number().int(),
  max_weight: z.number(), 
  reps: z.number().int(),
}).strict();

export const cardioSchema = z.object({
  id: z.number().int(),
  user_id: z.number().int(),
  title: z.string().min(1),
  kilometers: z.coerce.number(),           
  minutes: z.coerce.number().int(),
  created_at: z.coerce.date(),             
}).strict();



export const strengthSchema = z.object({
  id: z.number().int(),
  user_id: z.number().int(),
  title: z.string().min(1),
  created_at: z.coerce.date(),
  exercises: z.array(exerciseSchema).optional()
  
}).strict();

export type Cardio = z.infer<typeof cardioSchema>;
export type Strength = z.infer<typeof strengthSchema>;
