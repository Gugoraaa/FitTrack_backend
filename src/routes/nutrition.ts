import { Router } from "express";
import {addOrUpdateCalories, getTodayCalories, getCaloriesGoal,getFoodEntriesToday } from "../controllers/nutritionController";

const router = Router();


router.post("/logCalories", addOrUpdateCalories);
router.post("/getTodayCalories", getTodayCalories);
router.post("/getCaloriesGoal", getCaloriesGoal);
router.post("/getFoodEntriesToday", getFoodEntriesToday);

export default router;