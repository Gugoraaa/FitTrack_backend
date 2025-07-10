
import { Request, Response } from "express";
import {
  addCardioSession,
  getCardioSessionsByUser,
  deleteCardioSession,
  getLastCardioSessionsByUser
} from "../models/workoutCardioModel";

export const createCardioSession = async (req: Request, res: Response): Promise<any> => {
  const { user_id, title, kilometers, minutes } = req.body;

  if (!user_id || !title || kilometers == null || minutes == null) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newSession = await addCardioSession(
      Number(user_id),
      title,
      Number(kilometers),
      Number(minutes)
    );

    res.status(201).json(newSession);
  } catch (err) {
    console.error("Error adding cardio session:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /workouts/cardio/user
export const getUserCardioSessions = async (req: Request, res: Response): Promise<any> => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const sessions = await getCardioSessionsByUser(Number(user_id));
    res.status(200).json(sessions);
  } catch (err) {
    console.error("Error fetching cardio sessions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserLastCardioSessions = async (req: Request, res: Response): Promise<any> => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const sessions = await getLastCardioSessionsByUser(Number(user_id));
    res.status(200).json(sessions);
  } catch (err) {
    console.error("Error fetching cardio sessions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /workouts/cardio/delete/:id
export const removeCardioSession = async (req: Request, res: Response): Promise<any> => {
  
  const {id } = req.body;

  if (!id ) {
    return res.status(400).json({ message: "Missing data." });
  }

  try {
    const deleted = await deleteCardioSession(Number(id));
    if (!deleted) {
      return res.status(404).json({ message: "Session not found or not authorized." });
    }

    res.status(200).json({ message: "Session deleted successfully." });
  } catch (err) {
    console.error("Error deleting session:", err);
    res.status(500).json({ message: "Server error" });
  }
};
