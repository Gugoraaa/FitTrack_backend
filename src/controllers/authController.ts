import { Request, Response } from "express";
import { hashPassword, comparePasswords } from "../middleware/encrypt";
import { findUserByusername, createUser } from "../models/authModel";
import {
  loginSchema,
  type PublicUser,
  type UserWithPassword,
} from "../schemas/user.schema";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

const JWT_KEY: string | undefined = process.env.JWT_SECRET_KEY;

export const registerUser = async (req: Request,res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues,
    });
    return;
  }

  const { username, password } = parsed.data;

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
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues,
    });
    return;
  }

  const { username, password } = parsed.data;

  try {
    const userData = await findUserByusername(username);

    if (!userData) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const user: UserWithPassword = {
      id: userData.id,
      username: userData.username,
      password: userData.password,
      created_at: userData.created_at,
      daily_calorie_goal: userData.daily_calorie_goal,
    };

    const isMatch = await comparePasswords(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_KEY as string,
      {
        expiresIn: "1h",
      }
    );

    const publicUser: PublicUser = {
      id: user.id,
      username: user.username,
      created_at: user.created_at,
      
    };

    res
      .cookie("access_token", token, { ...cookieOptions, maxAge: 3600000 })
      .status(200)
      .json({
        message: "Login successful",
        publicUser,
        token,
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const logOut = (req: Request, res: Response): void => {
  res.clearCookie("access_token", cookieOptions);
  res.status(200).json({ message: "Logout successful" });
};

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies.access_token;

  if (!token) {
    console.log("NO ENCONTRE LA TOKEN");
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    res.status(200).json({ authenticated: true, user: decoded });
    return;
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
    console.log(err);
    return;
  }
};
