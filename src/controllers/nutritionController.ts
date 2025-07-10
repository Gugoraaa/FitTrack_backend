import { Request, Response } from "express";
import { fetchNutrition } from "../config/nutritionix";
import { getDailyCaloriesDb,addOrUpdateCaloriesDb, getCaloriesGoalDb,getFoodEntriesTodayDb,addFoodEntry } from "../models/nutritionModel";
import { promises } from "dns";


const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'


export const addOrUpdateCalories = async (req: Request, res: Response): Promise<void> => {
  const { user_id, query } = req.body;

  if (!user_id || !query) {
    res.status(400).json({ message: "user_id and query are required" });
    return;
  }

  try {
    const nutritionData = await fetchNutrition(query) as { foods: any[] };
    const foods = nutritionData.foods;

    const totalCalories = foods.reduce(
      (sum: number, item: any) => sum + (item.nf_calories || 0),
      0
    );

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    try {
      const updated = await addOrUpdateCaloriesDb(user_id, today, totalCalories);
      const newFoodlog = await addFoodEntry(user_id,query, totalCalories)
      res.status(200).json({ message: "Calories updated", data: updated, totalCalories });
    } catch (error) {
      console.error("Error adding/updating calories:", error);
      res.status(500).json({ message: "Database error" });
    }
  } catch (error) {
    console.error("Error fetching nutrition data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTodayCalories = async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.body;

  if (!user_id) {
    res.status(400).json({ message: "user_id is required" });
    return
  }

  try {
    const data = await getDailyCaloriesDb(user_id,today);
    if (!data) {
      const updated = await addOrUpdateCaloriesDb(user_id, today,0);
    }
    res.status(200).json({ calories: data?.total_calories || 0 });
  } catch (error) {
    console.error("Error getting today's calories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCaloriesGoal = async (req: Request, res: Response): Promise<void> => {  
  const { user_id } = req.body;

  if (!user_id) {
    res.status(400).json({ message: "user_id is required" });
    return;
  }

  try {
    const goal = await getCaloriesGoalDb(user_id);
    if (!goal) {
      res.status(404).json({ message: "User not found or no goal set" });
      return;
    }
    res.status(200).json({ daily_calorie_goal: goal.daily_calorie_goal });
  } catch (error) {
    console.error("Error getting calorie goal:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const getFoodEntriesToday = async (req: Request, res: Response):Promise<void> => {
  const { user_id } = req.body;
  if (!user_id) {
    res.status(400).json({ message: "user_id is required" });
  }

  try {
    const rows = await getFoodEntriesTodayDb(user_id);

    res.status(200).json({ entries: rows });
  } catch (err) {
    console.error("Error fetching food entries:", err);
    res.status(500).json({ message: "Server error" });
  }
};
