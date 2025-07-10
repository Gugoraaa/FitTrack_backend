import { Request, Response } from "express";
import { addStrengthWorkout, getStrengthSessions,deleteStrengthSession,getLastStrengthSessions } from "../models/workoutStrenghtModel";

export const createStrengthWorkout = async (req: Request, res: Response): Promise<any> => {
  const { user_id, title, exercises } = req.body;

  if (!user_id || !title || !Array.isArray(exercises) || exercises.length === 0) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const savedWorkout = await addStrengthWorkout(
      Number(user_id),
      title,
      exercises
    );

    res.status(201).json(savedWorkout);
  } catch (err) {
    console.error("Error adding strength workout:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getUserLastStrengtSessions = async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.body;

  if (!user_id) {
    res.status(400).json({ message: "User ID is required." });
    return;
  }

  try {
    const sessions = await getLastStrengthSessions(Number(user_id));

    const formatted = sessions.map((session) => ({
      ...session,
      formatted_date: new Date(session.created_at).toLocaleDateString("en-US"),
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching strength workouts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStrengthWorkouts = async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.body;

  if (!user_id) {
    res.status(400).json({ message: "User ID is required." });
    return;
  }

  try {
    const sessions = await getStrengthSessions(Number(user_id));

    const formatted = sessions.map((session) => ({
      ...session,
      formatted_date: new Date(session.created_at).toLocaleDateString("en-US"),
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching strength workouts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeStrengthSession = async (req: Request, res: Response): Promise<any> => {
  
  const {id } = req.body;

  if (!id ) {
    return res.status(400).json({ message: "Missing data." });
  }

  try {
    const deleted = await deleteStrengthSession(Number(id));
    if (!deleted) {
      return res.status(404).json({ message: "Session not found or not authorized." });
    }

    res.status(200).json({ message: "Session deleted successfully." });
  } catch (err) {
    console.error("Error deleting session:", err);
    res.status(500).json({ message: "Server error" });
  }
};