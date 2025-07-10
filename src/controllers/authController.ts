import { Request, Response } from "express";
import { hashPassword, comparePasswords } from "../middleware/encrypt";
import { findUserByusername, createUser } from "../models/authModel";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username  || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ message: "Password must be at least 8 characters" });
    return;
  }

  try {
    const existingUser = await findUserByusername(username);
    if (existingUser) {
      res.status(400).json({ message: "username is already registered" });
      return;
    }

    const hashed = await hashPassword(password);
    const user = await createUser(username, hashed);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "username and password are required" });
    return;
  }

  try {
    const user = await findUserByusername(username);

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await comparePasswords(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        daily_calorie_goal: user.daily_calorie_goal
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
