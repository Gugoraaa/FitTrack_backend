import { Request, Response } from "express";
import {updateUsernameDb, updateCalorieGoalDb,getUserDataDb} from "../models/profileModel";
import { findUserByusername } from "../models/authModel";

export const updateUsername = async (req: Request, res: Response): Promise<void> => {
    const { userId, newUsername } = req.body;
    
    if (!userId || !newUsername) {
        res.status(400).json({ message: "userId and newUsername are required" });
        return;
    }
    
    try{
        const existingUser = await findUserByusername(newUsername);
        if (existingUser) {
            res.status(400).json({ message: "Username is already taken" });
            return;
        }
    }catch (error) {    
        console.error("Error checking existing username:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
    try {
        const updatedUser = await updateUsernameDb(userId, newUsername);
        res.status(200).json({ message: "Username updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating username:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const updateCalorieGoal = async (req: Request, res: Response): Promise<void> => {
    const { userId, newGoal } = req.body;

    if (!userId || newGoal == null) {
        res.status(400).json({ message: "userId and newGoal are required" });
        return;
    }

    try {
        const updatedUser = await updateCalorieGoalDb(userId, newGoal);
        res.status(200).json({ message: "Calorie goal updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating calorie goal:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getUserData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userID } = req.body;

    if (!userID) {
      res.status(400).json({ message: "Missing userID" });
      return;
    }

    const data = await getUserDataDb(userID);

    if (!data) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const User = {
      username: data.username,
      created_at: data.created_at,
      daily_calorie_goal: data.daily_calorie_goal,
      userID: userID
    };

    res.status(200).json(User);
  } catch (error) {
    console.error("Error in getUserData:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
