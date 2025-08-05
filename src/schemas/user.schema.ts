import {z} from "zod";

export const userSchema = z.object({
    id:z.number(),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    created_at:z.string(),
    daily_calorie_goal: z.string()    
})

export type UserWithPassword= z.infer<typeof userSchema>;

export type PublicUser = Omit<UserWithPassword, 'password' | 'daily_calorie_goal'>;


export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;