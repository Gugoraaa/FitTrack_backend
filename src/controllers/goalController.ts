import { Request, Response } from "express";
import { createGoal, getGoalsByUser, updateGoal, deleteGoalById} from "../models/goalModel";

export const addGoal = async (req: Request, res: Response): Promise<void> => {
  const { user_id, name, end_date } = req.body;
  
  try {
    const newGoal = await createGoal(user_id, name, end_date);
    res.status(201).json({
      message: "Goal created successfully",
      goal: newGoal,
    });
    return
  } catch (error) {
    console.error("Error creating goal:", error);
    
     res.status(500).json({ message: "Server error" });
     return
  }
};
export const getUserGoals = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;


    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }

    try {
        const goals = await getGoalsByUser(Number(userId));
        res.status(200).json(goals);
    } catch (error) {
        console.error("Error fetching goals:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const editGoal = async (req: Request, res: Response) : Promise<void> => {
  const { id, name, end_date, status } = req.body;

  if (!id || !name || !end_date || !status) {
    res.status(400).json({ message: "Missing fields." });
    return
  }

  try {
    await updateGoal(id, name, end_date, status);
    res.status(200).json({ message: "Goal updated successfully." });
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const deleteGoal = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: "Goal ID is required." });
    return;
  }

  try {
    await deleteGoalById(id);
    res.status(200).json({ message: "Goal deleted successfully." });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ message: "Server error." });
  }
}